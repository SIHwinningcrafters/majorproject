import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { INCIDENTS } from "../../data/mockData";
import SeverityBadge from "../shared/SeverityBadge";

/* pin color per severity */
const PIN_COLOR = {
  high:   "var(--red)",
  medium: "var(--amber)",
  low:    "var(--green)",
};

/* rough % positions on our fake map canvas */
const PIN_POSITIONS = {
  "1": { left: "38%", top: "44%" },
  "2": { left: "55%", top: "30%" },
  "3": { left: "28%", top: "62%" },
  "4": { left: "66%", top: "22%" },
  "5": { left: "47%", top: "72%" },
};

const CATEGORY_ICONS = {
  Harassment:      "⚠️",
  "Poor Lighting": "🔦",
  Theft:           "🎒",
  "Safe Zone":     "✅",
  "Unsafe Road":   "🚧",
};

export default function MapDashboard() {
  const { selectedIncident, setSelectedIncident, sidebarOpen, toggleSidebar } = useApp();
  const { user, openAuthModal } = useAuth();

  /* counts for stats bar */
  const highCount   = INCIDENTS.filter((i) => i.severity === "high").length;
  const medCount    = INCIDENTS.filter((i) => i.severity === "medium").length;
  const safeCount   = INCIDENTS.filter((i) => i.severity === "low").length;

  return (
    <div style={styles.wrap}>
      {/* ── GRID BACKGROUND ── */}
      <div style={styles.grid} />

      {/* ── BLOBS ── */}
      <div style={{ ...styles.blob, width: 320, height: 320, top: "15%", left: "30%", background: "rgba(232,64,42,0.18)" }} />
      <div style={{ ...styles.blob, width: 260, height: 260, top: "50%", left: "55%", background: "rgba(245,166,35,0.14)" }} />
      <div style={{ ...styles.blob, width: 200, height: 200, top: "60%", left: "20%", background: "rgba(39,174,96,0.12)" }} />

      {/* ── FAKE ROAD LINES ── */}
      <svg style={styles.roads} viewBox="0 0 1000 700" preserveAspectRatio="none">
        <g stroke="rgba(255,255,255,0.045)" strokeWidth="1.5" fill="none">
          <line x1="0" y1="350" x2="1000" y2="350" />
          <line x1="500" y1="0"   x2="500" y2="700" />
          <line x1="0" y1="180" x2="1000" y2="260" />
          <line x1="0" y1="520" x2="1000" y2="460" />
          <line x1="200" y1="0" x2="320" y2="700" />
          <line x1="720" y1="0" x2="650" y2="700" />
          <path d="M0,420 Q250,380 500,350 T1000,300" />
          <path d="M0,200 Q300,320 600,280 T1000,180" />
        </g>
      </svg>

      {/* ── MAP PINS ── */}
      {INCIDENTS.map((inc) => {
        const pos = PIN_POSITIONS[inc.id];
        const isSelected = selectedIncident?.id === inc.id;
        return (
          <button
            key={inc.id}
            onClick={() => setSelectedIncident(isSelected ? null : inc)}
            style={{
              ...styles.pin,
              left: pos.left,
              top:  pos.top,
              transform: isSelected
                ? "translate(-50%, -100%) scale(1.22)"
                : "translate(-50%, -100%)",
              zIndex: isSelected ? 20 : 10,
            }}
          >
            {/* pin teardrop body */}
            <div
              style={{
                ...styles.pinBody,
                background: PIN_COLOR[inc.severity],
                boxShadow: isSelected
                  ? `0 0 0 4px ${PIN_COLOR[inc.severity]}44, 0 4px 18px rgba(0,0,0,0.6)`
                  : "0 3px 14px rgba(0,0,0,0.5)",
              }}
            >
              <span style={styles.pinIcon}>
                {CATEGORY_ICONS[inc.category] ?? "📍"}
              </span>
            </div>
          </button>
        );
      })}

      {/* ── SIDEBAR TOGGLE (only when sidebar is closed) ── */}
      {!sidebarOpen && (
        <button style={styles.sidebarToggle} onClick={toggleSidebar}>
          ☰
        </button>
      )}

      {/* ── STATS BAR (top-left, shifts right if sidebar is open) ── */}
      <div style={{ ...styles.statsBar, left: sidebarOpen ? 16 : 64 }}>
        <StatPill value={INCIDENTS.length} label="Total"  color="var(--muted2)" />
        <StatPill value={highCount}         label="High"   color="#f87262" />
        <StatPill value={medCount}          label="Medium" color="#f5c963" />
        <StatPill value={safeCount}         label="Safe"   color="#5dd992" />
      </div>

      {/* ── ZOOM CONTROLS (decorative for now) ── */}
      <div style={styles.zoomCtrl}>
        <button style={styles.zoomBtn}>+</button>
        <button style={styles.zoomBtn}>−</button>
      </div>

      {/* ── LEGEND ── */}
      <div style={styles.legend}>
        <div style={styles.legendTitle}>Severity</div>
        {[
          { color: "var(--red)",   label: "High risk" },
          { color: "var(--amber)", label: "Medium risk" },
          { color: "var(--green)", label: "Safe / Low" },
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
          onReport={() => {
            if (!user) openAuthModal("login");
          }}
          user={user}
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
function IncidentPopup({ incident, onClose, user, onReport }) {
  return (
    <div style={styles.popup}>
      {/* close */}
      <button onClick={onClose} style={styles.popupClose}>✕</button>

      {/* header */}
      <div style={styles.popupHeader}>
        <SeverityBadge severity={incident.severity} />
        <span style={{ fontSize: 11, color: "var(--muted)" }}>{incident.time}</span>
      </div>

      {/* category */}
      <div style={styles.popupCat}>
        {CATEGORY_ICONS[incident.category] ?? "📍"} {incident.category}
      </div>

      {/* description */}
      <p style={styles.popupDesc}>{incident.description}</p>

      {/* location */}
      <div style={styles.popupLoc}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {incident.location.label}
      </div>

      <div style={styles.popupDivider} />

      {/* reporter */}
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>
        Reported by{" "}
        <span style={{ color: "var(--text)", fontWeight: 600 }}>
          @{incident.reportedBy}
        </span>
      </div>

      {/* CTA */}
      {!user && (
        <button onClick={onReport} style={styles.popupCta}>
          + Report a similar incident
        </button>
      )}
    </div>
  );
}

// /* ── ALL STYLES ── */
const styles = {
  wrap: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    background: "var(--dark)",
  },

  /* GRID */
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)," +
      "linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
    backgroundSize: "60px 60px",
    zIndex: 0,
  },

  /* BLOBS (glow) */
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.6,
    zIndex: 1,
  },

  /* ROADS */
  roads: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 2,
  },

  /* PIN */
  pin: {
    position: "absolute",
    zIndex: 10,
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    transition: "all .2s ease",
  },

  pinBody: {
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    transform: "rotate(-45deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid rgba(255,255,255,0.2)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
  },

  pinIcon: {
    transform: "rotate(45deg)",
    fontSize: 13,
  },

  /* SIDEBAR BUTTON */
  sidebarToggle: {
    position: "absolute",
    top: 14,
    left: 14,
    zIndex: 100,
    width: 38,
    height: 38,
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "rgba(20,22,30,0.8)",
    backdropFilter: "blur(10px)",
    color: "var(--muted)",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
  },

  /* STATS */
  statsBar: {
    position: "absolute",
    top: 16,
    zIndex: 20,
    display: "flex",
    gap: 10,
    transition: "left .25s ease",
  },

  statPill: {
    background: "rgba(20,22,30,0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    padding: "7px 14px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
  },

  /* ZOOM */
  zoomCtrl: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 20,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  zoomBtn: {
    width: 36,
    height: 36,
    background: "rgba(20,22,30,0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    color: "var(--text)",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  /* LEGEND */
  legend: {
    position: "absolute",
    bottom: 20,
    left: 16,
    zIndex: 20,
    background: "rgba(20,22,30,0.85)",
    backdropFilter: "blur(12px)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    padding: "14px 16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  },

  legendTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: 10,
  },

  legendRow: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 6,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },

  /* POPUP */
  popup: {
    position: "absolute",
    bottom: 24,
    right: 20,
    zIndex: 30,
    width: 300,
    background: "rgba(24,28,35,0.9)",
    backdropFilter: "blur(14px)",
    border: "1px solid var(--border2)",
    borderRadius: "var(--r-lg)",
    padding: "18px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
    animation: "fadeUp .3s ease",
  },

  popupClose: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "none",
    border: "none",
    color: "var(--muted)",
    fontSize: 14,
    cursor: "pointer",
  },

  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  popupCat: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--muted)",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  popupDesc: {
    fontSize: 13,
    color: "var(--text)",
    opacity: 0.9,
    lineHeight: 1.5,
    marginBottom: 10,
  },

  popupLoc: {
    fontSize: 11,
    color: "var(--muted)",
    display: "flex",
    gap: 5,
  },

  popupDivider: {
    height: 1,
    background: "var(--border)",
    margin: "12px 0",
  },

  popupCta: {
    width: "100%",
    padding: "9px",
    borderRadius: "var(--r-sm)",
    border: "1px dashed rgba(255,77,77,0.5)",
    background: "var(--red-dim)",
    color: "var(--red)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};