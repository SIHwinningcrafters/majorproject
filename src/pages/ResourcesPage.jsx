const HELPLINES = [
  {
    name: "Police",
    number: "100",
    desc: "Emergency police assistance",
    icon: "🚔",
    color: "#6c8ef5",
  },
  {
    name: "Women Helpline",
    number: "1091",
    desc: "24/7 support for women in distress",
    icon: "👩",
    color: "#f87262",
  },
  {
    name: "Ambulance",
    number: "108",
    desc: "Medical emergency services",
    icon: "🚑",
    color: "#5dd992",
  },
  {
    name: "Child Helpline",
    number: "1098",
    desc: "Support for children in need",
    icon: "🧒",
    color: "#f5c963",
  },
  {
    name: "Cyber Crime",
    number: "1930",
    desc: "Report online fraud & cybercrime",
    icon: "💻",
    color: "#a78bfa",
  },
  {
    name: "Disaster Mgmt",
    number: "1070",
    desc: "Natural disaster & emergency relief",
    icon: "🆘",
    color: "#fb923c",
  },
];

const TIPS = [
  {
    category: "While Travelling",
    icon: "🚶",
    tips: [
      "Share your live location with a trusted contact.",
      "Prefer well-lit, populated routes especially at night.",
      "Keep emergency numbers saved and accessible.",
      "Trust your instincts — if something feels off, leave.",
    ],
  },
  {
    category: "Digital Safety",
    icon: "📱",
    tips: [
      "Don't share personal details with strangers online.",
      "Use strong, unique passwords and enable 2FA.",
      "Be cautious of unsolicited calls asking for OTPs.",
      "Report suspicious online activity to Cyber Crime (1930).",
    ],
  },
  {
    category: "At Home",
    icon: "🏠",
    tips: [
      "Know your neighbours — community awareness helps.",
      "Keep important documents and emergency cash handy.",
      "Install locks and basic security on all entry points.",
      "Have a family emergency plan and meeting point.",
    ],
  },
  {
    category: "For Women",
    icon: "💪",
    tips: [
      "Use apps like Nirbhaya, Shake2Safety for SOS alerts.",
      "Note down vehicle numbers if you feel unsafe in a cab.",
      "Sit near the driver or in busy compartments in transit.",
      "Self-defence classes can build confidence and skills.",
    ],
  },
];

const APPS = [
  { name: "Nirbhaya: Be Fearless", desc: "SOS alert with live tracking", icon: "🛡️" },
  { name: "Himmat Plus",           desc: "Delhi Police women safety app", icon: "📲" },
  { name: "Shake2Safety",          desc: "Shake phone to send SOS", icon: "📳" },
  { name: "bSafe",                 desc: "Personal safety & alarm app", icon: "🔔" },
];

export default function ResourcesPage() {
  return (
    <div style={styles.page}>

      {/* ── HEADER ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Safety Resources</h1>
          <p style={styles.sub}>Helplines, tips, and tools to keep you and your community safe.</p>
        </div>
      </div>

      {/* ── EMERGENCY HELPLINES ── */}
      <Section title="🚨 Emergency Helplines" sub="India national helpline numbers — available 24/7">
        <div style={styles.helplineGrid}>
          {HELPLINES.map((h) => (
            <div key={h.name} style={styles.helplineCard}>
              <div style={{
                ...styles.helplineIcon,
                background: `${h.color}18`,
                border: `1px solid ${h.color}30`,
              }}>
                <span style={{ fontSize: 22 }}>{h.icon}</span>
              </div>
              <div style={styles.helplineInfo}>
                <div style={styles.helplineName}>{h.name}</div>
                <div style={styles.helplineDesc}>{h.desc}</div>
              </div>
              
                href={`tel:${h.number}`}
                style={{
                  ...styles.callBtn,
                  background: `${h.color}18`,
                  border: `1px solid ${h.color}30`,
                  color: h.color,
                }}
              >
                📞 {h.number}
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SAFETY TIPS ── */}
      <Section title="💡 Safety Tips" sub="Practical advice for everyday situations">
        <div style={styles.tipsGrid}>
          {TIPS.map((t) => (
            <div key={t.category} style={styles.tipCard}>
              <div style={styles.tipHeader}>
                <span style={styles.tipIcon}>{t.icon}</span>
                <span style={styles.tipCategory}>{t.category}</span>
              </div>
              <ul style={styles.tipList}>
                {t.tips.map((tip, i) => (
                  <li key={i} style={styles.tipItem}>
                    <span style={styles.tipBullet}>→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SAFETY APPS ── */}
      <Section title="📱 Recommended Safety Apps" sub="Download these for quick SOS access">
        <div style={styles.appsGrid}>
          {APPS.map((app) => (
            <div key={app.name} style={styles.appCard}>
              <div style={styles.appIcon}>{app.icon}</div>
              <div>
                <div style={styles.appName}>{app.name}</div>
                <div style={styles.appDesc}>{app.desc}</div>
              </div>
              <button style={styles.appBtn}>↗ Get</button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── COMMUNITY PLEDGE ── */}
      <div style={styles.pledge}>
        <div style={styles.pledgeIcon}>🤝</div>
        <h3 style={styles.pledgeTitle}>Community Safety Pledge</h3>
        <p style={styles.pledgeSub}>
          SafeMap works because of people like you. Every report, every tip,
          every shared resource makes your neighbourhood a little safer.
        </p>
        <div style={styles.pledgeBadge}>
          ✅ You're part of the SafeMap community
        </div>
      </div>

    </div>
  );
}

/* ── SECTION WRAPPER ── */
function Section({ title, sub, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitle}>{title}</div>
        <div style={styles.sectionSub}>{sub}</div>
      </div>
      {children}
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
    marginBottom: 28,
  },
  heading: {
    fontFamily: "var(--font-display)",
    fontSize: 26, fontWeight: 800,
    letterSpacing: "-0.4px", marginBottom: 4,
  },
  sub: { fontSize: 13, color: "var(--muted)" },

  section: { marginBottom: 36 },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 17, fontWeight: 700,
    marginBottom: 3,
  },
  sectionSub: { fontSize: 12, color: "var(--muted)" },

  /* helplines */
  helplineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 10,
  },
  helplineCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    animation: "fadeUp .3s ease both",
  },
  helplineIcon: {
    width: 44, height: 44,
    borderRadius: "var(--r-sm)",
    display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0,
  },
  helplineInfo: { flex: 1, minWidth: 0 },
  helplineName: {
    fontSize: 13, fontWeight: 600, marginBottom: 2,
  },
  helplineDesc: { fontSize: 11, color: "var(--muted)" },
  callBtn: {
    padding: "6px 14px",
    borderRadius: "var(--r-sm)",
    fontSize: 12, fontWeight: 700,
    textDecoration: "none",
    flexShrink: 0,
    fontFamily: "var(--font-display)",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },

  /* tips */
  tipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
  },
  tipCard: {
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    padding: "16px 18px",
    animation: "fadeUp .35s ease both",
  },
  tipHeader: {
    display: "flex", alignItems: "center",
    gap: 8, marginBottom: 12,
  },
  tipIcon: { fontSize: 20 },
  tipCategory: {
    fontFamily: "var(--font-display)",
    fontSize: 14, fontWeight: 700,
  },
  tipList: {
    listStyle: "none",
    display: "flex", flexDirection: "column", gap: 8,
  },
  tipItem: {
    display: "flex", gap: 8,
    fontSize: 12, lineHeight: 1.55,
    color: "var(--muted2)",
  },
  tipBullet: {
    color: "var(--red)",
    fontWeight: 700, flexShrink: 0,
  },

  /* apps */
  appsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 10,
  },
  appCard: {
    display: "flex", alignItems: "center",
    gap: 12, padding: "12px 14px",
    background: "var(--dark3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    animation: "fadeUp .3s ease both",
  },
  appIcon: {
    width: 40, height: 40,
    borderRadius: "var(--r-sm)",
    background: "var(--dark4)",
    border: "1px solid var(--border)",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 20,
    flexShrink: 0,
  },
  appName: { fontSize: 13, fontWeight: 600, marginBottom: 2 },
  appDesc: { fontSize: 11, color: "var(--muted)" },
  appBtn: {
    marginLeft: "auto",
    padding: "5px 12px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)", fontSize: 11,
    cursor: "pointer", flexShrink: 0,
  },

  /* pledge */
  pledge: {
    textAlign: "center",
    padding: "40px 32px",
    background: "linear-gradient(135deg, rgba(232,64,42,0.08), rgba(245,166,35,0.06))",
    border: "1px solid rgba(232,64,42,0.15)",
    borderRadius: "var(--r-xl)",
    marginBottom: 32,
    animation: "fadeUp .4s ease both",
  },
  pledgeIcon: { fontSize: 40, marginBottom: 12 },
  pledgeTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 20, fontWeight: 800,
    marginBottom: 10,
  },
  pledgeSub: {
    fontSize: 13, color: "var(--muted)",
    lineHeight: 1.7, maxWidth: 480,
    margin: "0 auto 20px",
  },
  pledgeBadge: {
    display: "inline-block",
    padding: "8px 20px",
    background: "rgba(39,174,96,0.12)",
    border: "1px solid rgba(39,174,96,0.25)",
    borderRadius: 20,
    fontSize: 13, fontWeight: 600,
    color: "#5dd992",
  },
};