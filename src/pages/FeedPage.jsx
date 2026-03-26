import { useState } from "react";
import { INCIDENTS, FILTER_CHIPS } from "../data/mockData";
import SeverityBadge from "../components/shared/SeverityBadge";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const CATEGORY_ICONS = {
  Harassment:      "⚠️",
  "Poor Lighting": "🔦",
  Theft:           "🎒",
  "Safe Zone":     "✅",
  "Unsafe Road":   "🚧",
};

const SORT_OPTIONS = ["Newest", "Oldest", "Severity"];

export default function FeedPage() {
  const { openAuthModal } = useApp();
  const { user } = useAuth();

  const [search, setSearch]       = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [sort, setSort]           = useState("Newest");
  const [expanded, setExpanded]   = useState(null);

  /* ── filter + sort ── */
  const filtered = INCIDENTS
    .filter((inc) => {
      const matchSearch =
        inc.description.toLowerCase().includes(search.toLowerCase()) ||
        inc.category.toLowerCase().includes(search.toLowerCase()) ||
        inc.location.label.toLowerCase().includes(search.toLowerCase());

      const matchChip =
        activeChip === "All" ||
        inc.severity.toLowerCase() === activeChip.toLowerCase() ||
        inc.category.toLowerCase() === activeChip.toLowerCase();

      return matchSearch && matchChip;
    })
    .sort((a, b) => {
      if (sort === "Severity") {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.severity] - order[b.severity];
      }
      if (sort === "Oldest") return a.id - b.id;
      return b.id - a.id; // Newest
    });

  return (
    <div style={styles.page}>
      {/* ── PAGE HEADER ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Incident Feed</h1>
          <p style={styles.subheading}>
            All community-reported incidents, newest first.
          </p>
        </div>

        {user ? (
          <button style={styles.reportBtn} onClick={() => {}}>
            + Report Incident
          </button>
        ) : (
          <button style={styles.reportBtn} onClick={() => openAuthModal("signup")}>
            + Join to Report
          </button>
        )}
      </div>

      {/* ── TOOLBAR ── */}
      <div style={styles.toolbar}>
        {/* search */}
        <div style={styles.searchBox}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            style={styles.searchInput}
            placeholder="Search incidents, locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* sort */}
        <div style={styles.sortWrap}>
          {SORT_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              style={{
                ...styles.sortBtn,
                ...(sort === s ? styles.sortBtnActive : {}),
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── FILTER CHIPS ── */}
      <div style={styles.chips}>
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            style={{
              ...styles.chip,
              ...(activeChip === chip ? styles.chipActive : {}),
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* ── RESULT COUNT ── */}
      <div style={styles.count}>
        Showing <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> incident
        {filtered.length !== 1 ? "s" : ""}
        {activeChip !== "All" && (
          <span> · filtered by <strong style={{ color: "var(--text)" }}>{activeChip}</strong></span>
        )}
      </div>

      {/* ── FEED LIST ── */}
      <div style={styles.feed}>
        {filtered.length === 0 ? (
          <EmptyState onClear={() => { setSearch(""); setActiveChip("All"); }} />
        ) : (
          filtered.map((inc, i) => (
            <FeedCard
              key={inc.id}
              incident={inc}
              index={i}
              expanded={expanded === inc.id}
              onToggle={() => setExpanded(expanded === inc.id ? null : inc.id)}
              onReport={() => !user && openAuthModal("login")}
              user={user}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ── FEED CARD ── */
function FeedCard({ incident, index, expanded, onToggle, onReport, user }) {
  return (
    <div
      style={{
        ...styles.card,
        borderLeftColor: expanded ? "var(--red)" : "transparent",
        animationDelay: `${index * 0.06}s`,
      }}
    >
      {/* ── CARD HEADER ── */}
      <div style={styles.cardHeader} onClick={onToggle}>
        <div style={styles.cardLeft}>
          <div style={styles.cardIconWrap}>
            <span style={styles.cardIcon}>
              {CATEGORY_ICONS[incident.category] ?? "📍"}
            </span>
          </div>
          <div>
            <div style={styles.cardCategory}>{incident.category}</div>
            <div style={styles.cardLocation}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {incident.location.label}
            </div>
          </div>
        </div>

        <div style={styles.cardRight}>
          <SeverityBadge severity={incident.severity} />
          <span style={styles.cardTime}>{incident.time}</span>
          <span style={{ color: "var(--muted)", fontSize: 16, transition: "transform .2s",
            display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            ⌄
          </span>
        </div>
      </div>

      {/* ── DESCRIPTION (always visible) ── */}
      <p style={styles.cardDesc}>{incident.description}</p>

      {/* ── EXPANDED DETAILS ── */}
      {expanded && (
        <div style={styles.expandedArea}>
          <div style={styles.divider} />

          {/* meta row */}
          <div style={styles.metaRow}>
            <MetaChip icon="👤" label={`@${incident.reportedBy}`} />
            <MetaChip icon="📍" label={incident.location.label} />
            <MetaChip icon="🕐" label={incident.time} />
          </div>

          {/* coordinates */}
          <div style={styles.coords}>
            <span style={{ color: "var(--muted)" }}>Coordinates:</span>{" "}
            <span style={{ fontFamily: "monospace", fontSize: 12 }}>
              {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
            </span>
          </div>

          {/* actions */}
          <div style={styles.actions}>
            <button
              style={styles.actionBtn}
              onClick={() => !user ? onReport() : null}
            >
              🔁 Report Similar
            </button>
            <button style={styles.actionBtnGhost}>
              🔗 Share
            </button>
            <button style={styles.actionBtnGhost}>
              🚩 Flag
            </button>
          </div>

          {!user && (
            <div style={styles.loginNudge}>
              <span style={{ color: "var(--muted)" }}>
                Want to report or comment?
              </span>{" "}
              <button style={styles.nudgeBtn} onClick={onReport}>
                Log in →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── META CHIP ── */
function MetaChip({ icon, label }) {
  return (
    <div style={styles.metaChip}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ── EMPTY STATE ── */
function EmptyState({ onClear }) {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>🔍</div>
      <div style={styles.emptyTitle}>No incidents found</div>
      <div style={styles.emptySub}>Try adjusting your search or filters.</div>
      <button style={styles.clearBtn} onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

/* ── STYLES ── */
const styles = {
  page: {
    height: "100%",
    overflowY: "auto",
    padding: "32px 40px",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  heading: {
    fontFamily: "var(--font-display)",
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: "-0.4px",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "var(--muted)",
  },
  reportBtn: {
    padding: "9px 20px",
    borderRadius: "var(--r-sm)",
    border: "none",
    background: "var(--red)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    cursor: "pointer",
    flexShrink: 0,
  },
  toolbar: {
    display: "flex",
    gap: 12,
    marginBottom: 14,
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    padding: "9px 13px",
    flex: 1,
    minWidth: 200,
  },
  searchInput: {
    flex: 1,
    background: "none",
    border: "none",
    outline: "none",
    color: "var(--text)",
    fontSize: 13,
    fontFamily: "var(--font-body)",
  },
  sortWrap: {
    display: "flex",
    gap: 4,
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    padding: 4,
  },
  sortBtn: {
    padding: "5px 12px",
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: "var(--muted)",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all .15s",
  },
  sortBtnActive: {
    background: "var(--dark5)",
    color: "var(--text)",
  },
  chips: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  chip: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
    cursor: "pointer",
    transition: "all .2s",
  },
  chipActive: {
    background: "var(--dark4)",
    color: "var(--text)",
    borderColor: "var(--border2)",
  },
  count: {
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 16,
  },
  feed: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderLeft: "2px solid transparent",
    borderRadius: "var(--r-md)",
    padding: "16px 20px",
    transition: "border-color .2s, background .2s",
    animation: "fadeUp .35s ease both",
    cursor: "default",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    cursor: "pointer",
    gap: 12,
  },
  cardLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: "var(--r-sm)",
    background: "var(--dark4)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: 18,
  },
  cardCategory: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 2,
  },
  cardLocation: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 11,
    color: "var(--muted)",
  },
  cardRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  cardTime: {
    fontSize: 11,
    color: "var(--muted)",
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 1.55,
    color: "var(--muted2)",
    paddingLeft: 50,
  },
  expandedArea: {
    marginTop: 14,
    animation: "fadeUp .2s ease both",
  },
  divider: {
    height: 1,
    background: "var(--border)",
    marginBottom: 14,
  },
  metaRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  metaChip: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 20,
    background: "var(--dark4)",
    border: "1px solid var(--border)",
    fontSize: 11,
    color: "var(--muted2)",
  },
  coords: {
    fontSize: 12,
    color: "var(--muted)",
    marginBottom: 14,
  },
  actions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  actionBtn: {
    padding: "7px 14px",
    borderRadius: "var(--r-sm)",
    border: "none",
    background: "var(--red-dim)",
    color: "#f87262",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  actionBtnGhost: {
    padding: "7px 14px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
    fontSize: 12,
    cursor: "pointer",
  },
  loginNudge: {
    marginTop: 12,
    fontSize: 12,
    color: "var(--muted)",
  },
  nudgeBtn: {
    background: "none",
    border: "none",
    color: "var(--red)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: { fontSize: 36, marginBottom: 4 },
  emptyTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 16,
    fontWeight: 700,
  },
  emptySub: { fontSize: 13, color: "var(--muted)" },
  clearBtn: {
    marginTop: 8,
    padding: "8px 20px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
    fontSize: 13,
    cursor: "pointer",
  },
};