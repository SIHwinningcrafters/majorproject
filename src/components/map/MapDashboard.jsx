import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useIncidents } from "../../hooks/useIncidents";
import SeverityBadge from "../shared/SeverityBadge";
import L from "leaflet";

/* fix leaflet's default marker icon broken by webpack */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORY_ICONS = {
  Harassment:      "⚠️",
  "Poor Lighting": "🔦",
  Theft:           "🎒",
  "Safe Zone":     "✅",
  "Unsafe Road":   "🚧",
  Suspicious:      "👁️",
  Accident:        "🚗",
  Other:           "📌",
};

const SEV_COLOR = {
  high:   "#E8402A",
  medium: "#F5A623",
  low:    "#27AE60",
};

/* build a custom colored SVG pin for each severity */
const makeIcon = (severity, selected = false) => {
  const color = SEV_COLOR[severity] || SEV_COLOR.medium;
  const size  = selected ? 38 : 30;
  const svg   = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 30 39">
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
      </filter>
      <path filter="url(#shadow)"
        d="M15 0C6.716 0 0 6.716 0 15c0 10.314 15 24 15 24S30 25.314 30 15C30 6.716 23.284 0 15 0z"
        fill="${color}"
        stroke="rgba(255,255,255,0.3)"
        stroke-width="1.5"
      />
      <circle cx="15" cy="15" r="6" fill="rgba(255,255,255,0.35)"/>
    </svg>`;

  return L.divIcon({
    html:      `<div>${svg}</div>`,
    className: "",
    iconSize:     [size, size * 1.3],
    iconAnchor:   [size / 2, size * 1.3],
    popupAnchor:  [0, -(size * 1.3)],
  });
};

export default function MapDashboard() {
  const { selectedIncident, setSelectedIncident, sidebarOpen, toggleSidebar } = useApp();
  const { user, openAuthModal }  = useAuth();
  const { incidents, loading }   = useIncidents();

  const mapRef       = useRef(null); // DOM node
  const leafletRef   = useRef(null); // Leaflet map instance
  const markersRef   = useRef({});   // { incidentId: L.marker }

  /* ── initialise map once ── */
  useEffect(() => {
    if (leafletRef.current) return; // already initialised

    leafletRef.current = L.map(mapRef.current, {
      center:          [22.7196, 75.8577], // Indore, India
      zoom:            13,
      zoomControl:     false,
      attributionControl: false,
    });

    /* dark tile layer from CartoDB */
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '© <a href="https://carto.com/">CARTO</a>',
        subdomains:  "abcd",
        maxZoom:     19,
      }
    ).addTo(leafletRef.current);

    /* subtle attribution */
    L.control.attribution({ position: "bottomright", prefix: false })
      .addTo(leafletRef.current);

    /* custom zoom control top-right */
    L.control.zoom({ position: "topright" }).addTo(leafletRef.current);

    return () => {
      leafletRef.current?.remove();
      leafletRef.current = null;
    };
  }, []);

  /* ── add/update markers when incidents load ── */
  useEffect(() => {
    if (!leafletRef.current || loading) return;

    /* remove old markers */
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    incidents.forEach((inc) => {
      const { lat, lng } = inc.location;
      if (!lat || !lng) return;

      const marker = L.marker([lat, lng], {
        icon: makeIcon(inc.severity, false),
      }).addTo(leafletRef.current);

      marker.on("click", () => {
        setSelectedIncident((prev) =>
          prev?.id === inc.id ? null : inc
        );
      });

      markersRef.current[inc.id || inc._id] = marker;
    });
  }, [incidents, loading]);

  /* ── update marker size when selection changes ── */
  useEffect(() => {
    if (!leafletRef.current) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const inc      = incidents.find((i) => (i.id || i._id) === id);
      const selected = selectedIncident?.id === id || selectedIncident?._id === id;
      if (inc) marker.setIcon(makeIcon(inc.severity, selected));
    });

    /* pan to selected incident */
    if (selectedIncident?.location) {
      const { lat, lng } = selectedIncident.location;
      leafletRef.current.panTo([lat, lng], { animate: true, duration: 0.5 });
    }
  }, [selectedIncident]);

  /* ── invalidate size when sidebar toggles ── */
  useEffect(() => {
    setTimeout(() => leafletRef.current?.invalidateSize(), 320);
  }, [sidebarOpen]);

  /* ── counts ── */
  const highCount = incidents.filter((i) => i.severity === "high").length;
  const medCount  = incidents.filter((i) => i.severity === "medium").length;
  const safeCount = incidents.filter((i) => i.severity === "low").length;

  return (
    <div style={styles.wrap}>

      {/* ── LEAFLET MAP ── */}
      <div ref={mapRef} style={styles.map} />

      {/* ── SIDEBAR TOGGLE ── */}
      {!sidebarOpen && (
        <button style={styles.sidebarToggle} onClick={toggleSidebar}>☰</button>
      )}

      {/* ── STATS BAR ── */}
      <div style={{ ...styles.statsBar, left: sidebarOpen ? 16 : 64 }}>
        <StatPill value={loading ? "…" : incidents.length} label="Total"  color="var(--muted2)" />
        <StatPill value={loading ? "…" : highCount}        label="High"   color="#f87262" />
        <StatPill value={loading ? "…" : medCount}         label="Medium" color="#f5c963" />
        <StatPill value={loading ? "…" : safeCount}        label="Safe"   color="#5dd992" />
      </div>

      {/* ── LEGEND ── */}
      <div style={styles.legend}>
        <div style={styles.legendTitle}>Severity</div>
        {[
          { color: "#E8402A", label: "High risk"   },
          { color: "#F5A623", label: "Medium risk" },
          { color: "#27AE60", label: "Safe / Low"  },
        ].map(({ color, label }) => (
          <div key={label} style={styles.legendRow}>
            <span style={{ ...styles.legendDot, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* ── SELECTED INCIDENT POPUP ── */}
      {selectedIncident && (
        <IncidentPopup
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          user={user}
          openAuthModal={openAuthModal}
        />
      )}
    </div>
  );
}

/* ── STAT PILL ── */
function StatPill({ value, label, color }) {
  return (
    <div style={styles.statPill}>
      <strong style={{ fontFamily: "var(--font-display)", fontSize: 14, color }}>
        {value}
      </strong>
      <span style={{ color: "var(--muted)", fontSize: 12 }}>{label}</span>
    </div>
  );
}

/* ── INCIDENT POPUP ── */
function IncidentPopup({ incident, onClose, user, openAuthModal }) {
  return (
    <div style={styles.popup}>
      <button onClick={onClose} style={styles.popupClose}>✕</button>

      <div style={styles.popupHeader}>
        <SeverityBadge severity={incident.severity} />
        <span style={{ fontSize: 11, color: "var(--muted)" }}>{incident.time}</span>
      </div>

      <div style={styles.popupCat}>
        {CATEGORY_ICONS[incident.category] ?? "📍"} {incident.category}
      </div>

      <p style={styles.popupDesc}>{incident.description}</p>

      <div style={styles.popupLoc}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {incident.location.label}
      </div>

      <div style={styles.popupDivider} />

      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>
        Reported by{" "}
        <span style={{ color: "var(--text)", fontWeight: 600 }}>
          @{incident.reportedBy}
        </span>
      </div>

      {!user && (
        <button
          onClick={() => openAuthModal("login")}
          style={styles.popupCta}
        >
          + Report a similar incident
        </button>
      )}
    </div>
  );
}

/* ── STYLES ── */
const styles = {
  wrap: {
    width: "100%", height: "100%",
    overflow: "hidden", position: "relative",
    background: "#0D0F14",
  },
  map: {
    width: "100%", height: "100%",
    zIndex: 0,
  },
  sidebarToggle: {
    position: "absolute", top: 14, left: 14,
    zIndex: 100, width: 36, height: 36,
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "rgba(13,15,20,0.88)",
    backdropFilter: "blur(8px)",
    color: "var(--muted)", fontSize: 16,
    display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  },
  statsBar: {
    position: "absolute", top: 16,
    zIndex: 20, display: "flex", gap: 8,
    transition: "left .28s cubic-bezier(.4,0,.2,1)",
  },
  statPill: {
    background: "rgba(13,15,20,0.88)",
    backdropFilter: "blur(10px)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    padding: "7px 13px",
    display: "flex", alignItems: "center", gap: 6,
  },
  legend: {
    position: "absolute", bottom: 28, left: 16,
    zIndex: 20,
    background: "rgba(13,15,20,0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    padding: "13px 16px",
  },
  legendTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 10, fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted)", marginBottom: 9,
  },
  legendRow: {
    display: "flex", alignItems: "center",
    gap: 7, fontSize: 11, color: "var(--muted)", marginBottom: 6,
  },
  legendDot: {
    width: 8, height: 8,
    borderRadius: "50%", flexShrink: 0,
  },
  popup: {
    position: "absolute", bottom: 24, right: 20,
    zIndex: 30, width: 300,
    background: "var(--dark3)",
    border: "1px solid var(--border2)",
    borderRadius: "var(--r-lg)",
    padding: "18px 18px 16px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
    animation: "slideUp .25s ease both",
  },
  popupClose: {
    position: "absolute", top: 12, right: 12,
    background: "none", border: "none",
    color: "var(--muted)", fontSize: 14, cursor: "pointer",
  },
  popupHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 8,
  },
  popupCat: {
    fontSize: 11, fontWeight: 600,
    color: "var(--muted)", letterSpacing: "0.06em",
    textTransform: "uppercase", marginBottom: 6,
  },
  popupDesc: {
    fontSize: 13, lineHeight: 1.55,
    opacity: 0.85, marginBottom: 10,
  },
  popupLoc: {
    display: "flex", alignItems: "center",
    gap: 5, fontSize: 11, color: "var(--muted)",
  },
  popupDivider: {
    height: 1, background: "var(--border)", margin: "12px 0",
  },
  popupCta: {
    width: "100%", padding: 9,
    borderRadius: "var(--r-sm)",
    border: "1px dashed rgba(232,64,42,0.4)",
    background: "var(--red-dim)",
    color: "#f87262", fontSize: 12,
    fontWeight: 600, cursor: "pointer",
  },
};