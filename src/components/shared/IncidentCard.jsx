import SeverityBadge from "./SeverityBadge";

const CATEGORY_ICONS = {
  Harassment:    "⚠️",
  "Poor Lighting": "🔦",
  Theft:         "🎒",
  "Safe Zone":   "✅",
  "Unsafe Road": "🚧",
};

export default function IncidentCard({ incident, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        ...(selected ? styles.cardSelected : {}),
      }}
    >
      {/* Top row: badge + time */}
      <div style={styles.topRow}>
        <SeverityBadge severity={incident.severity} />
        <span style={styles.time}>{incident.time}</span>
      </div>

      {/* Category */}
      <div style={styles.category}>
        {CATEGORY_ICONS[incident.category] ?? "📍"} {incident.category}
      </div>

      {/* Description */}
      <p style={styles.desc}>{incident.description}</p>

      {/* Location */}
      <div style={styles.loc}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {incident.location.label}
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: "15px 20px",
    borderBottom: "1px solid var(--border)",
    borderLeft: "2px solid transparent",
    cursor: "pointer",
    transition: "background .15s",
    animation: "slideInL .3s ease both",
  },
  cardSelected: {
    background: "var(--dark3)",
    borderLeftColor: "var(--red)",
    paddingLeft: 18,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  time: {
    fontSize: 11,
    color: "var(--muted)",
  },
  category: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--muted)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 1.5,
    marginBottom: 8,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  loc: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    color: "var(--muted)",
  },
};