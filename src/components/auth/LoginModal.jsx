import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export default function LoginModal() {
  const { closeAuthModal, openAuthModal } = useApp();
  const { login } = useAuth();

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    // simulate async login
    setTimeout(() => {
      login({ username: email.split("@")[0], email });
      setLoading(false);
      closeAuthModal();
    }, 800);
  };

  return (
    <Overlay onClose={closeAuthModal}>
      <div style={styles.modal}>
        {/* close */}
        <button style={styles.closeBtn} onClick={closeAuthModal}>✕</button>

        {/* header */}
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          SafeMap
        </div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Log in to report and track incidents near you.</p>

        {/* form */}
        <div style={styles.form}>
          <Field label="Email address">
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </Field>

          <Field label="Password">
            <input
              style={styles.input}
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </Field>

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Log in →"}
          </button>
        </div>

        {/* footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>Don't have an account?</span>
          <button style={styles.switchBtn} onClick={() => openAuthModal("signup")}>
            Sign up
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ── shared sub-components ── */
export function Overlay({ children, onClose }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ animation: "slideUp .25s ease both" }}>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={styles.label}>
        {label}
        {hint && <span style={styles.hint}> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <span
      style={{
        width: 16, height: 16,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin .7s linear infinite",
      }}
    />
  );
}

/* ── styles ── */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(4px)",
  zIndex: 300,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const styles = {
  modal: {
    width: "100%",
    maxWidth: 420,
    background: "var(--dark3)",
    border: "1px solid var(--border2)",
    borderRadius: "var(--r-xl)",
    padding: "32px 32px 24px",
    position: "relative",
    boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
  },
  closeBtn: {
    position: "absolute",
    top: 16, right: 16,
    background: "none",
    border: "none",
    color: "var(--muted)",
    fontSize: 16,
    cursor: "pointer",
  },
  brand: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginBottom: 20,
  },
  brandDot: {
    width: 8, height: 8,
    background: "var(--red)",
    borderRadius: "50%",
    display: "inline-block",
    animation: "pulse-dot 2s ease-in-out infinite",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 6,
    letterSpacing: "-0.3px",
  },
  sub: {
    fontSize: 13,
    color: "var(--muted)",
    marginBottom: 24,
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--muted2)",
  },
  hint: {
    fontWeight: 400,
    color: "var(--muted)",
    fontSize: 12,
  },
  input: {
    background: "var(--dark4)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color .2s",
    width: "100%",
  },
  error: {
    background: "rgba(232,64,42,0.12)",
    border: "1px solid rgba(232,64,42,0.25)",
    borderRadius: "var(--r-sm)",
    padding: "9px 13px",
    fontSize: 13,
    color: "#f87262",
  },
  submitBtn: {
    width: "100%",
    padding: "11px",
    borderRadius: "var(--r-sm)",
    border: "none",
    background: "var(--red)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    transition: "opacity .2s",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid var(--border)",
  },
  footerText: {
    fontSize: 13,
    color: "var(--muted)",
  },
  switchBtn: {
    background: "none",
    border: "none",
    color: "var(--red)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
};