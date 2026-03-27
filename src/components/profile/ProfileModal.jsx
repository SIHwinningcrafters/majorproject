import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useIncidents } from "../../hooks/useIncidents";
import { Overlay } from "../auth/LoginModal";
import SeverityBadge from "../shared/SeverityBadge";

export default function ProfileModal() {
  const { closeProfile } = useApp();
  const { user, logout } = useAuth();
  const { incidents }    = useIncidents();

  /* incidents reported by this user */
  const myIncidents = incidents.filter(
    (inc) => inc.reportedBy === user?.username || inc.reportedBy?._id === user?._id
  );

  const [tab, setTab] = useState("overview"); // "overview" | "reports"

  const handleLogout = () => {
    logout();
    closeProfile();
  };

  return (
    <Overlay onClose={closeProfile}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={closeProfile}>✕</button>

        {/* ── PROFILE HEADER ── */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarLarge}>
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" style={styles.avatarImg} />
            ) : (
              <span style={styles.avatarInitial}>
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </span>
            )}
          </div>

          <div style={styles.profileInfo}>
            <h2 style={styles.username}>@{user?.username}</h2>
            <p style={styles.email}>{user?.email}</p>
            {user?.bio && <p style={styles.bio}>{user.bio}</p>}

            <div style={styles.statChips}>
              <div style={styles.statChip}>
                <strong style={{ fontFamily: "var(--font-display)", color: "var(--red)" }}>
                  {myIncidents.length}
                </strong>
                <span style={{ color: "var(--muted)", fontSize: 11 }}>Reports</span>
              </div>
              <div style={styles.statChip}>
                <strong style={{ fontFamily: "var(--font-display)", color: "#5dd992" }}>
                  {user?.role ?? "user"}
                </strong>
                <span style={{ color: "var(--muted)", fontSize: 11 }}>Role</span>
              </div>
              <div style={styles.statChip}>
                <strong style={{ fontFamily: "var(--font-display)", color: "#f5c963" }}>
                  Active
                </strong>
                <span style={{ color: "var(--muted)", fontSize: 11 }}>Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={styles.tabs}>
          {["overview", "reports"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            >
              {t === "overview" ? "👤 Overview" : `📋 My Reports (${myIncidents.length})`}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div style={styles.tabContent}>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div style={styles.overviewGrid}>
              <InfoRow label="Username"   value={`@${user?.username}`} />
              <InfoRow label="Email"      value={user?.email} />
              <InfoRow label="Bio"        value={user?.bio || "No bio yet"} />
              <InfoRow label="Role"       value={user?.role ?? "user"} />
              <InfoRow label="Reports"    value={`${myIncidents.length} submitted`} />

              <div style={styles.divider} />

              <div style={styles.dangerZone}>
                <div style={styles.dangerTitle}>Account</div>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  🚪 Log out
                </button>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {tab === "reports" && (
            <div style={styles.reportsList}>
              {myIncidents.length === 0 ? (
                <div style={styles.emptyReports}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>No reports yet</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    Your submitted incidents will appear here.
                  </div>
                </div>
              ) : (
                myIncidents.map((inc) => (
                  <div key={inc.id || inc._id} style={styles.reportCard}>
                    <div style={styles.reportTop}>
                      <SeverityBadge severity={inc.severity} />
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{inc.time}</span>
                    </div>
                    <div style={styles.reportCat}>{inc.category}</div>
                    <p style={styles.reportDesc}>{inc.description}</p>
                    <div style={styles.reportLoc}>📍 {inc.location?.label}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

const styles = {
  modal: {
    width: "100%", maxWidth: 480,
    background: "var(--dark3)", border: "1px solid var(--border2)",
    borderRadius: "var(--r-xl)", padding: "28px",
    position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
    maxHeight: "88vh", overflowY: "auto",
  },
  closeBtn: {
    position: "absolute", top: 16, right: 16,
    background: "none", border: "none",
    color: "var(--muted)", fontSize: 16, cursor: "pointer",
  },
  profileHeader: {
    display: "flex", gap: 18, alignItems: "flex-start",
    marginBottom: 22,
  },
  avatarLarge: {
    width: 72, height: 72, borderRadius: "50%",
    border: "2px solid var(--border2)",
    background: "var(--dark4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", flexShrink: 0,
  },
  avatarImg:     { width: "100%", height: "100%", objectFit: "cover" },
  avatarInitial: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--text)" },
  profileInfo:   { flex: 1, minWidth: 0 },
  username:      { fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, marginBottom: 3 },
  email:         { fontSize: 12, color: "var(--muted)", marginBottom: 6 },
  bio:           { fontSize: 13, color: "var(--muted2)", lineHeight: 1.5, marginBottom: 10 },
  statChips:     { display: "flex", gap: 8 },
  statChip: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "6px 12px", background: "var(--dark4)",
    border: "1px solid var(--border)", borderRadius: "var(--r-sm)",
    gap: 2,
  },
  tabs: {
    display: "flex", gap: 4,
    background: "var(--dark4)", borderRadius: "var(--r-sm)",
    padding: 4, marginBottom: 18,
  },
  tab: {
    flex: 1, padding: "7px 12px",
    borderRadius: 6, border: "none",
    background: "transparent", color: "var(--muted)",
    fontSize: 12, fontWeight: 500, cursor: "pointer",
    transition: "all .15s",
  },
  tabActive:   { background: "var(--dark3)", color: "var(--text)" },
  tabContent:  { minHeight: 180 },
  overviewGrid: { display: "flex", flexDirection: "column", gap: 2 },
  infoRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "10px 0",
    borderBottom: "1px solid var(--border)",
  },
  infoLabel: { fontSize: 12, color: "var(--muted)", fontWeight: 500 },
  infoValue: { fontSize: 13, color: "var(--text)", textAlign: "right", maxWidth: "60%" },
  divider:   { height: 1, background: "var(--border)", margin: "12px 0" },
  dangerZone:  { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dangerTitle: { fontSize: 12, color: "var(--muted)", fontWeight: 600 },
  logoutBtn: {
    padding: "7px 16px", borderRadius: "var(--r-sm)",
    border: "1px solid rgba(232,64,42,0.3)",
    background: "rgba(232,64,42,0.1)",
    color: "#f87262", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  reportsList:  { display: "flex", flexDirection: "column", gap: 10 },
  emptyReports: { textAlign: "center", padding: "32px 20px", color: "var(--muted)" },
  reportCard: {
    background: "var(--dark4)", border: "1px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "13px 15px",
  },
  reportTop:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  reportCat:  { fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 },
  reportDesc: { fontSize: 13, lineHeight: 1.5, opacity: 0.8, marginBottom: 6 },
  reportLoc:  { fontSize: 11, color: "var(--muted)" },
};