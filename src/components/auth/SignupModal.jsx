

import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Overlay, Field, Spinner } from "./LoginModal";

export default function SignupModal() {
  const { closeAuthModal, openAuthModal } = useApp();
  const { signup } = useAuth();

  const [step, setStep]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [avatarPreview, setAvatar] = useState(null);

  /* step 1 fields */
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [err1, setErr1]         = useState("");

  /* step 2 fields */
  const [bio, setBio]   = useState("");
  const [err2] = useState("");

  const submitStep1 = () => {
    setErr1("");
    if (!username || !email || !password) {
      setErr1("Username, email and password are required.");
      return;
    }
    if (password.length < 6) {
      setErr1("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErr1("Passwords do not match.");
      return;
    }
    setStep(2);
  };

//   const submitStep2 = () => {
//     setLoading(true);
//     setTimeout(() => {
//       signup({ username, email, bio, avatar: avatarPreview });
//       setLoading(false);
//       closeAuthModal();
//     }, 900);
//   };
const submitStep2 = async () => {
  setLoading(true);
  try {
    await signup({ username, email, password, bio, avatar: avatarPreview });
    closeAuthModal();
  } catch (err) {
    console.log("FULL ERROR:", err.response?.data); // 👈 add this
    setErr2(err.response?.data?.message || "Signup failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <Overlay onClose={closeAuthModal}>
      <div style={styles.modal}>
        {/* close */}
        <button style={styles.closeBtn} onClick={closeAuthModal}>✕</button>

        {/* brand */}
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          SafeMap
        </div>

        {/* step indicator */}
        <Steps current={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <h2 style={styles.title}>Create your account</h2>
            <p style={styles.sub}>Join the community keeping each other safe.</p>

            <div style={styles.form}>
              <Field label="Anonymous username" hint="shown publicly instead of your name">
                <input
                  style={styles.input}
                  placeholder="e.g. SafeWalker_21"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>

              <Field label="Email address">
                <input
                  style={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <div style={styles.row}>
                <Field label="Password">
                  <input
                    style={styles.input}
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                <Field label="Confirm password">
                  <input
                    style={styles.input}
                    type="password"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </Field>
              </div>

              {err1 && <div style={styles.error}>{err1}</div>}

              <button style={styles.submitBtn} onClick={submitStep1}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <h2 style={styles.title}>Your profile</h2>
            <p style={styles.sub}>Both fields are optional — you can skip and add later.</p>

            <div style={styles.form}>
              {/* avatar upload */}
              <div style={styles.avatarRow}>
                <div
                  style={styles.avatarCircle}
                  onClick={() => document.getElementById("av-upload").click()}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" style={styles.avatarImg} />
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--muted)" }}>
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>
                    Profile photo
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                    Optional · JPG or PNG · max 2MB
                  </div>
                  <button
                    style={styles.uploadBtn}
                    onClick={() => document.getElementById("av-upload").click()}
                  >
                    Upload photo
                  </button>
                  <input
                    id="av-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatar}
                  />
                </div>
              </div>

              <Field label="Bio" hint="optional">
                <textarea
                  style={{ ...styles.input, resize: "vertical", minHeight: 80 }}
                  placeholder="e.g. Daily commuter in Indore, want to make roads safer."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Field>

              {err2 && <div style={styles.error}>{err2}</div>}

              <div style={styles.row}>
                <button
                  style={styles.backBtn}
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  style={{ ...styles.submitBtn, flex: 1, opacity: loading ? 0.7 : 1 }}
                  onClick={submitStep2}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Create account →"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account?</span>
          <button style={styles.switchBtn} onClick={() => openAuthModal("login")}>
            Log in
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// /* ── step indicator ── */

function Steps({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      {/* Step 1 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: current >= 1 ? "var(--red)" : "var(--dark5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700,
          color: "#fff", transition: "background .3s",
        }}>
          {current > 1 ? "✓" : "1"}
        </div>
        <span style={{
          fontSize: 12, fontWeight: current === 1 ? 600 : 400,
          color: current >= 1 ? "var(--text)" : "var(--muted)",
        }}>
          Account
        </span>
      </div>

      {/* Connector line */}
      <div style={{
        flex: 1, height: 1,
        background: current > 1 ? "var(--red)" : "var(--border)",
        transition: "background .3s",
      }} />

      {/* Step 2 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: current >= 2 ? "var(--red)" : "var(--dark5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700,
          color: current >= 2 ? "#fff" : "var(--muted)",
          transition: "background .3s",
        }}>
          2
        </div>
        <span style={{
          fontSize: 12, fontWeight: current === 2 ? 600 : 400,
          color: current >= 2 ? "var(--text)" : "var(--muted)",
        }}>
          Profile
        </span>
      </div>
    </div>
  );
}


// function Steps({ current }) {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
//       {[1, 2].map((n, i) => (
//         <>
//           <div key={n} style={{
//             display: "flex", alignItems: "center", gap: 6,
//           }}>
//             <div style={{
//               width: 22, height: 22,
//               borderRadius: "50%",
//               background: current >= n ? "var(--red)" : "var(--dark5)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 11, fontWeight: 700,
//               color: current >= n ? "#fff" : "var(--muted)",
//               transition: "background .3s",
//             }}>
//               {current > n ? "✓" : n}
//             </div>
//             <span style={{
//               fontSize: 12,
//               color: current >= n ? "var(--text)" : "var(--muted)",
//               fontWeight: current >= n ? 600 : 400,
//             }}>
//               {n === 1 ? "Account" : "Profile"}
//             </span>
//           </div>
//           {i === 0 && (
//             <div style={{
//               flex: 1, height: 1,
//               background: current > 1 ? "var(--red)" : "var(--border)",
//               transition: "background .3s",
//             }} />
//           )}
//         </>
//       ))}
//     </div>
//   );
// }


const styles = {
  modal: {
    width: "100%",
    maxWidth: 460,
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
    background: "none", border: "none",
    color: "var(--muted)", fontSize: 16, cursor: "pointer",
  },
  brand: {
    fontFamily: "var(--font-display)",
    fontWeight: 800, fontSize: 15,
    display: "flex", alignItems: "center", gap: 7,
    marginBottom: 16,
  },
  brandDot: {
    width: 8, height: 8,
    background: "var(--red)", borderRadius: "50%",
    display: "inline-block",
    animation: "pulse-dot 2s ease-in-out infinite",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 22, fontWeight: 800,
    marginBottom: 6, letterSpacing: "-0.3px",
  },
  sub: {
    fontSize: 13, color: "var(--muted)",
    marginBottom: 22, lineHeight: 1.5,
  },
  form: {
    display: "flex", flexDirection: "column", gap: 16,
  },
  row: {
    display: "flex", gap: 12,
  },
  label: {
    fontSize: 13, fontWeight: 500, color: "var(--muted2)",
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
    width: "100%",
  },
  error: {
    background: "rgba(232,64,42,0.12)",
    border: "1px solid rgba(232,64,42,0.25)",
    borderRadius: "var(--r-sm)",
    padding: "9px 13px",
    fontSize: 13, color: "#f87262",
  },
  submitBtn: {
    width: "100%", padding: "11px",
    borderRadius: "var(--r-sm)",
    border: "none", background: "var(--red)",
    color: "#fff", fontSize: 14, fontWeight: 700,
    fontFamily: "var(--font-display)",
    cursor: "pointer",
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8,
    transition: "opacity .2s",
  },
  backBtn: {
    padding: "11px 20px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)", fontSize: 13,
    cursor: "pointer",
  },
  avatarRow: {
    display: "flex", alignItems: "center", gap: 16,
  },
  avatarCircle: {
    width: 72, height: 72,
    borderRadius: "50%",
    border: "2px dashed var(--border2)",
    background: "var(--dark4)",
    display: "flex", alignItems: "center",
    justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
    overflow: "hidden",
    transition: "border-color .2s",
  },
  avatarImg: {
    width: "100%", height: "100%", objectFit: "cover",
  },
  uploadBtn: {
    padding: "6px 14px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)", fontSize: 12,
    cursor: "pointer",
  },
  footer: {
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8,
    marginTop: 20, paddingTop: 16,
    borderTop: "1px solid var(--border)",
  },
  footerText: { fontSize: 13, color: "var(--muted)" },
  switchBtn: {
    background: "none", border: "none",
    color: "var(--red)", fontSize: 13,
    fontWeight: 600, cursor: "pointer",
  },
};