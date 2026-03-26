import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { id: "map",       label: "Live Map" },
  { id: "feed",      label: "Incident Feed" },
  { id: "analytics", label: "Analytics" },
  { id: "resources", label: "Resources" },
];

export default function Navbar() {
  const { activePage, setActivePage, openAuthModal } = useApp();
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      {/* ── LOGO ── */}
      <div style={styles.logo} onClick={() => setActivePage("map")}>
        <span style={styles.logoDot} />
        SafeMap
      </div>

      {/* ── NAV LINKS ── */}
      <ul style={styles.navLinks}>
        {NAV_LINKS.map((link) => (
          <li key={link.id}>
            <button
              style={{
                ...styles.navLink,
                ...(activePage === link.id ? styles.navLinkActive : {}),
              }}
              onClick={() => setActivePage(link.id)}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* ── RIGHT SIDE ACTIONS ── */}
      <div style={styles.actions}>
        {user ? (
          /* Logged in: show avatar + logout */
          <>
            <button
              style={styles.btnReport}
              onClick={() => openAuthModal(null)} /* will open report modal later */
            >
              + Report
            </button>
            <div style={styles.avatarWrap}>
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" style={styles.avatarImg} />
              ) : (
                <span style={styles.avatarInitial}>
                  {user.username?.[0]?.toUpperCase() ?? "U"}
                </span>
              )}
            </div>
            <button style={styles.btnGhost} onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          /* Logged out: show login + signup */
          <>
            <button style={styles.btnGhost} onClick={() => openAuthModal("login")}>
              Log in
            </button>
            <button style={styles.btnReport} onClick={() => openAuthModal("signup")}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ── STYLES ── */
const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: "var(--nav-h)",
    borderBottom: "1px solid var(--border)",
    background: "rgba(13,15,20,0.94)",
    backdropFilter: "blur(14px)",
    flexShrink: 0,
    zIndex: 200,
    position: "relative",
  },
  logo: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: 19,
    letterSpacing: "-0.4px",
    display: "flex",
    alignItems: "center",
    gap: 9,
    cursor: "pointer",
    userSelect: "none",
  },
  logoDot: {
    width: 9,
    height: 9,
    background: "var(--red)",
    borderRadius: "50%",
    flexShrink: 0,
    animation: "pulse-dot 2s ease-in-out infinite",
    display: "inline-block",
  },
  navLinks: {
    display: "flex",
    gap: 4,
    listStyle: "none",
  },
  navLink: {
    background: "none",
    border: "none",
    padding: "6px 14px",
    borderRadius: "var(--r-sm)",
    color: "var(--muted)",
    fontSize: 14,
    fontWeight: 500,
    transition: "all .2s",
    cursor: "pointer",
  },
  navLinkActive: {
    color: "var(--text)",
    background: "var(--dark3)",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  btnGhost: {
    padding: "7px 16px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
    fontSize: 13,
    fontWeight: 500,
    transition: "all .2s",
    cursor: "pointer",
  },
  btnReport: {
    padding: "7px 18px",
    borderRadius: "var(--r-sm)",
    border: "none",
    background: "var(--red)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    transition: "all .2s",
    cursor: "pointer",
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid var(--border2)",
    background: "var(--dark3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarInitial: {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 13,
    color: "var(--text)",
  },
};