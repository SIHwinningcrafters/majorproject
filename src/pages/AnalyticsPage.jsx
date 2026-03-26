import { INCIDENTS, SEVERITY_COLORS } from "../data/mockData";

/* ── derived stats ── */
const total      = INCIDENTS.length;
const highCount  = INCIDENTS.filter((i) => i.severity === "high").length;
const medCount   = INCIDENTS.filter((i) => i.severity === "medium").length;
const lowCount   = INCIDENTS.filter((i) => i.severity === "low").length;

const categoryCounts = INCIDENTS.reduce((acc, inc) => {
  acc[inc.category] = (acc[inc.category] || 0) + 1;
  return acc;
}, {});

const categoryData = Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1]);

const severityData = [
  { label: "High",   count: highCount, color: "#f87262", bg: "rgba(232,64,42,0.15)" },
  { label: "Medium", count: medCount,  color: "#f5c963", bg: "rgba(245,166,35,0.15)" },
  { label: "Low",    count: lowCount,  color: "#5dd992", bg: "rgba(39,174,96,0.15)" },
];

/* mock weekly trend data */
const TREND = [
  { day: "Mon", high: 2, medium: 1, low: 0 },
  { day: "Tue", high: 1, medium: 2, low: 1 },
  { day: "Wed", high: 3, medium: 1, low: 0 },
  { day: "Thu", high: 1, medium: 3, low: 2 },
  { day: "Fri", high: 4, medium: 2, low: 1 },
  { day: "Sat", high: 2, medium: 1, low: 3 },
  { day: "Sun", high: 1, medium: 0, low: 2 },
];
const TREND_MAX = Math.max(...TREND.map((d) => d.high + d.medium + d.low));

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

export default function AnalyticsPage() {
  return (
    <div style={styles.page}>

      {/* ── PAGE HEADER ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Analytics</h1>
          <p style={styles.sub}>Safety trends and incident breakdown for your area.</p>
        </div>
        <div style={styles.lastUpdated}>
          🕐 Last updated: just now
        </div>
      </div>

      {/* ── STAT CARDS ROW ── */}
      <div style={styles.statRow}>
        <StatCard value={total}     label="Total Reports"    icon="📋" color="var(--muted2)" />
        <StatCard value={highCount} label="High Severity"    icon="🔴" color="#f87262" />
        <StatCard value={medCount}  label="Medium Severity"  icon="🟡" color="#f5c963" />
        <StatCard value={lowCount}  label="Safe / Low Risk"  icon="🟢" color="#5dd992" />
      </div>

      {/* ── MAIN GRID ── */}
      <div style={styles.grid}>

        {/* ── WEEKLY TREND BAR CHART ── */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Weekly Incident Trend</div>
            <div style={styles.cardSub}>Last 7 days · stacked by severity</div>
          </div>

          <div style={styles.barChart}>
            {TREND.map((d) => {
              const stackTotal = d.high + d.medium + d.low;
              const heightPct  = (stackTotal / TREND_MAX) * 100;
              return (
                <div key={d.day} style={styles.barCol}>
                  <div style={styles.barWrap}>
                    <div
                      style={{
                        ...styles.barStack,
                        height: `${heightPct}%`,
                      }}
                    >
                      {/* stacked segments, bottom to top: low → medium → high */}
                      {d.low > 0 && (
                        <div style={{
                          flex: d.low,
                          background: "#5dd992",
                          opacity: 0.85,
                        }} />
                      )}
                      {d.medium > 0 && (
                        <div style={{
                          flex: d.medium,
                          background: "#f5c963",
                          opacity: 0.85,
                        }} />
                      )}
                      {d.high > 0 && (
                        <div style={{
                          flex: d.high,
                          background: "#f87262",
                          opacity: 0.85,
                        }} />
                      )}
                    </div>
                  </div>
                  <div style={styles.barLabel}>{d.day}</div>
                  <div style={styles.barCount}>{stackTotal}</div>
                </div>
              );
            })}
          </div>

          {/* legend */}
          <div style={styles.chartLegend}>
            {[
              { color: "#f87262", label: "High" },
              { color: "#f5c963", label: "Medium" },
              { color: "#5dd992", label: "Low" },
            ].map(({ color, label }) => (
              <div key={label} style={styles.legendItem}>
                <span style={{ width: 8, height: 8, borderRadius: 2,
                  background: color, display: "inline-block" }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── SEVERITY DONUT ── */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Severity Breakdown</div>
            <div style={styles.cardSub}>Distribution of all reports</div>
          </div>

          {/* fake donut using conic-gradient */}
          <div style={styles.donutWrap}>
            <div style={{
              width: 160, height: 160,
              borderRadius: "50%",
              background: `conic-gradient(
                #f87262 0deg ${(highCount / total) * 360}deg,
                #f5c963 ${(highCount / total) * 360}deg ${((highCount + medCount) / total) * 360}deg,
                #5dd992 ${((highCount + medCount) / total) * 360}deg 360deg
              )`,
              boxShadow: "0 0 0 6px var(--dark3), 0 0 0 7px var(--border)",
              position: "relative",
              flexShrink: 0,
            }}>
              {/* center hole */}
              <div style={{
                position: "absolute",
                inset: "30%",
                borderRadius: "50%",
                background: "var(--dark3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800, fontSize: 20,
                }}>
                  {total}
                </span>
                <span style={{ fontSize: 9, color: "var(--muted)", marginTop: 1 }}>
                  TOTAL
                </span>
              </div>
            </div>

            {/* labels */}
            <div style={styles.donutLabels}>
              {severityData.map((s) => (
                <div key={s.label} style={styles.donutLabel}>
                  <div style={styles.donutLabelLeft}>
                    <span style={{
                      width: 10, height: 10, borderRadius: 2,
                      background: s.color, display: "inline-block", flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13 }}>{s.label}</span>
                  </div>
                  <div style={styles.donutLabelRight}>
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700, fontSize: 15,
                      color: s.color,
                    }}>
                      {s.count}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>
                      ({Math.round((s.count / total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CATEGORY BREAKDOWN ── */}
        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Incidents by Category</div>
            <div style={styles.cardSub}>All time · sorted by frequency</div>
          </div>

          <div style={styles.catList}>
            {categoryData.map(([cat, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={cat} style={styles.catRow}>
                  <div style={styles.catLeft}>
                    <span style={styles.catIcon}>{CATEGORY_ICONS[cat] ?? "📌"}</span>
                    <span style={styles.catName}>{cat}</span>
                  </div>
                  <div style={styles.catBarWrap}>
                    <div
                      style={{
                        ...styles.catBar,
                        width: `${pct * 2.5}%`,
                      }}
                    />
                  </div>
                  <div style={styles.catCount}>
                    <strong style={{ fontFamily: "var(--font-display)" }}>{count}</strong>
                    <span style={{ color: "var(--muted)", marginLeft: 4 }}>({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── HOTSPOT AREAS ── */}
        <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Hotspot Areas</div>
            <div style={styles.cardSub}>Locations with most reported incidents</div>
          </div>

          <div style={styles.hotspotGrid}>
            {INCIDENTS.slice().sort((a, b) =>
              (a.severity === "high" ? 0 : 1) - (b.severity === "high" ? 0 : 1)
            ).map((inc, i) => (
              <div key={inc.id} style={styles.hotspotCard}>
                <div style={styles.hotspotRank}>#{i + 1}</div>
                <div style={styles.hotspotInfo}>
                  <div style={styles.hotspotLoc}>
                    📍 {inc.location.label}
                  </div>
                  <div style={styles.hotspotMeta}>
                    {CATEGORY_ICONS[inc.category]} {inc.category} ·{" "}
                    <span style={{
                      color: SEVERITY_COLORS[inc.severity]?.text,
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}>
                      {inc.severity}
                    </span>
                  </div>
                </div>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: SEVERITY_COLORS[inc.severity]?.text,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${SEVERITY_COLORS[inc.severity]?.text}`,
                }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── STAT CARD ── */
function StatCard({ value, label, icon, color }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>
      <div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 28, fontWeight: 800,
          color, lineHeight: 1,
        }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

/* ── STYLES ── */
const styles = {
  page: {
    height: "100%",
    overflowY: "auto",
    padding: "32px 40px",
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
    fontSize: 26, fontWeight: 800,
    letterSpacing: "-0.4px", marginBottom: 4,
  },
  sub: { fontSize: 13, color: "var(--muted)" },
  lastUpdated: {
    fontSize: 12, color: "var(--muted)",
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    padding: "6px 12px",
  },
  statRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12, marginBottom: 20,
  },
  statCard: {
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    animation: "fadeUp .3s ease both",
  },
  statIcon: { fontSize: 28 },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  card: {
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    padding: "20px 22px",
    animation: "fadeUp .35s ease both",
  },
  cardHeader: { marginBottom: 20 },
  cardTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 15, fontWeight: 700,
    marginBottom: 3,
  },
  cardSub: { fontSize: 12, color: "var(--muted)" },

  /* bar chart */
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    height: 140,
    padding: "0 4px",
  },
  barCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    gap: 4,
  },
  barWrap: {
    flex: 1, width: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
  barStack: {
    width: "100%",
    borderRadius: "4px 4px 0 0",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column-reverse",
    transition: "height .4s ease",
  },
  barLabel: { fontSize: 10, color: "var(--muted)" },
  barCount: {
    fontSize: 10,
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    color: "var(--muted2)",
  },
  chartLegend: {
    display: "flex", gap: 16,
    marginTop: 14,
    justifyContent: "center",
  },
  legendItem: {
    display: "flex", alignItems: "center",
    gap: 6, fontSize: 11, color: "var(--muted)",
  },

  /* donut */
  donutWrap: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
  },
  donutLabels: {
    display: "flex",
    flexDirection: "column",
    gap: 12, flex: 1, minWidth: 120,
  },
  donutLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  donutLabelLeft: {
    display: "flex", alignItems: "center", gap: 7,
  },
  donutLabelRight: {
    display: "flex", alignItems: "baseline",
  },

  /* category list */
  catList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  catRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  catLeft: {
    display: "flex", alignItems: "center",
    gap: 8, width: 160, flexShrink: 0,
  },
  catIcon: { fontSize: 16, flexShrink: 0 },
  catName: { fontSize: 13, fontWeight: 500 },
  catBarWrap: {
    flex: 1, height: 6,
    background: "var(--dark5)",
    borderRadius: 3, overflow: "hidden",
  },
  catBar: {
    height: "100%",
    background: "linear-gradient(90deg, var(--red), #ff7c6e)",
    borderRadius: 3,
    transition: "width .5s ease",
    maxWidth: "100%",
  },
  catCount: {
    fontSize: 13, width: 70,
    textAlign: "right", flexShrink: 0,
  },

  /* hotspots */
  hotspotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 10,
  },
  hotspotCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    background: "var(--dark4)",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
  },
  hotspotRank: {
    fontFamily: "var(--font-display)",
    fontSize: 12, fontWeight: 700,
    color: "var(--muted)",
    width: 24, flexShrink: 0,
  },
  hotspotInfo: { flex: 1, minWidth: 0 },
  hotspotLoc: {
    fontSize: 13, fontWeight: 500,
    marginBottom: 3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  hotspotMeta: { fontSize: 11, color: "var(--muted)" },
};