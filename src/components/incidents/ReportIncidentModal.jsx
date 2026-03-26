import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Overlay, Spinner } from "../auth/LoginModal";

const CATEGORIES = [
  { id: "Harassment",      icon: "⚠️",  label: "Harassment" },
  { id: "Theft",           icon: "🎒",  label: "Theft" },
  { id: "Poor Lighting",   icon: "🔦",  label: "Poor Lighting" },
  { id: "Unsafe Road",     icon: "🚧",  label: "Unsafe Road" },
  { id: "Safe Zone",       icon: "✅",  label: "Safe Zone" },
  { id: "Suspicious",      icon: "👁️",  label: "Suspicious Activity" },
  { id: "Accident",        icon: "🚗",  label: "Accident" },
  { id: "Other",           icon: "📌",  label: "Other" },
];

const SEVERITIES = [
  { id: "high",   color: "#f87262", bg: "rgba(232,64,42,0.12)",   border: "rgba(232,64,42,0.3)",  label: "High",   desc: "Immediate danger or threat" },
  { id: "medium", color: "#f5c963", bg: "rgba(245,166,35,0.12)",  border: "rgba(245,166,35,0.3)", label: "Medium", desc: "Concerning but not urgent" },
  { id: "low",    color: "#5dd992", bg: "rgba(39,174,96,0.12)",   border: "rgba(39,174,96,0.3)",  label: "Low",    desc: "Minor issue or safe zone" },
];

const STEPS = ["Details", "Location", "Review"];

export default function ReportIncidentModal() {
  const { closeReportModal } = useApp();
  const { user } = useAuth();

  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* form state */
  const [category, setCategory]     = useState("");
  const [severity, setSeverity]     = useState("");
  const [description, setDescription] = useState("");
  const [locLabel, setLocLabel]     = useState("");
  const [anonymous, setAnonymous]   = useState(false);
  const [err, setErr]               = useState("");

  const validateStep1 = () => {
    if (!category) return "Please select a category.";
    if (!severity) return "Please select a severity level.";
    if (description.trim().length < 20)
      return "Description must be at least 20 characters.";
    return "";
  };

  const validateStep2 = () => {
    if (!locLabel.trim()) return "Please enter a location.";
    return "";
  };

  const next = () => {
    setErr("");
    if (step === 1) {
      const e = validateStep1();
      if (e) { setErr(e); return; }
    }
    if (step === 2) {
      const e = validateStep2();
      if (e) { setErr(e); return; }
    }
    setStep((s) => s + 1);
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  /* ── SUCCESS SCREEN ── */
  if (submitted) {
    return (
      <Overlay onClose={closeReportModal}>
        <div style={{ ...styles.modal, textAlign: "center", padding: "48px 32px" }}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={{ ...styles.title, marginBottom: 8 }}>Report submitted!</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 28 }}>
            Thank you for keeping your community safe.<br />
            Your incident will appear on the map shortly.
          </p>
          <button style={styles.submitBtn} onClick={closeReportModal}>
            Back to map
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={closeReportModal}>
      <div style={styles.modal}>
        {/* close */}
        <button style={styles.closeBtn} onClick={closeReportModal}>✕</button>

        {/* brand */}
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          SafeMap
        </div>

        {/* step indicator */}
        <StepBar current={step} steps={STEPS} />

        {/* ── STEP 1: DETAILS ── */}
        {step === 1 && (
          <div style={styles.stepWrap}>
            <h2 style={styles.title}>What happened?</h2>
            <p style={styles.sub}>Select a category and describe the incident.</p>

            {/* category grid */}
            <div style={styles.sectionLabel}>Category</div>
            <div style={styles.catGrid}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  style={{
                    ...styles.catBtn,
                    ...(category === c.id ? styles.catBtnActive : {}),
                  }}
                >
                  <span style={styles.catIcon}>{c.icon}</span>
                  <span style={styles.catLabel}>{c.label}</span>
                </button>
              ))}
            </div>

            {/* severity */}
            <div style={{ ...styles.sectionLabel, marginTop: 20 }}>Severity</div>
            <div style={styles.sevRow}>
              {SEVERITIES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeverity(s.id)}
                  style={{
                    ...styles.sevBtn,
                    ...(severity === s.id
                      ? { background: s.bg, borderColor: s.border, color: s.color }
                      : {}),
                  }}
                >
                  <span style={{
                    width: 8, height: 8,
                    borderRadius: "50%",
                    background: s.color,
                    display: "inline-block",
                    flexShrink: 0,
                  }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* description */}
            <div style={{ ...styles.sectionLabel, marginTop: 20 }}>Description</div>
            <textarea
              style={styles.textarea}
              rows={4}
              placeholder="Describe what happened in detail — time, people involved, what you saw…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={styles.charCount}>
              <span style={{ color: description.length < 20 ? "var(--red)" : "var(--green)" }}>
                {description.length}
              </span> / 20 min chars
            </div>
          </div>
        )}

        {/* ── STEP 2: LOCATION ── */}
        {step === 2 && (
          <div style={styles.stepWrap}>
            <h2 style={styles.title}>Where did it happen?</h2>
            <p style={styles.sub}>Enter the location as precisely as you can.</p>

            <div style={styles.sectionLabel}>Location name</div>
            <input
              style={styles.input}
              placeholder="e.g. Vijay Nagar Bus Stop, Indore"
              value={locLabel}
              onChange={(e) => setLocLabel(e.target.value)}
            />

            {/* fake map picker */}
            <div style={styles.sectionLabel}>Pin on map</div>
            <div style={styles.mapPicker}>
              {/* grid */}
              <div style={styles.mapGrid} />
              {/* roads */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                viewBox="0 0 400 200" preserveAspectRatio="none">
                <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none">
                  <line x1="0" y1="100" x2="400" y2="100" />
                  <line x1="200" y1="0" x2="200" y2="200" />
                  <line x1="0" y1="60"  x2="400" y2="80" />
                  <line x1="0" y1="140" x2="400" y2="130" />
                  <path d="M0,100 Q100,80 200,100 T400,95" />
                </g>
              </svg>
              {/* center pin */}
              <div style={styles.centerPin}>
                <div style={styles.pinBody}>
                  <span style={{ transform: "rotate(45deg)", fontSize: 11 }}>📍</span>
                </div>
              </div>
              <div style={styles.mapHint}>
                Tap to place pin · drag to adjust
              </div>
            </div>

            {/* anonymous toggle */}
            <div style={styles.anonRow}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Report anonymously</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  Your username won't be shown publicly
                </div>
              </div>
              <button
                onClick={() => setAnonymous((p) => !p)}
                style={{
                  ...styles.toggle,
                  background: anonymous ? "var(--red)" : "var(--dark5)",
                }}
              >
                <span style={{
                  ...styles.toggleKnob,
                  transform: anonymous ? "translateX(20px)" : "translateX(2px)",
                }} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: REVIEW ── */}
        {step === 3 && (
          <div style={styles.stepWrap}>
            <h2 style={styles.title}>Review & submit</h2>
            <p style={styles.sub}>Double-check your report before submitting.</p>

            <div style={styles.reviewCard}>
              {/* category + severity */}
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Category</span>
                <span style={styles.reviewVal}>
                  {CATEGORIES.find((c) => c.id === category)?.icon}{" "}
                  {category}
                </span>
              </div>
              <div style={styles.reviewDivider} />

              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Severity</span>
                <span style={{
                  ...styles.reviewVal,
                  color: SEVERITIES.find((s) => s.id === severity)?.color,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}>
                  ● {severity}
                </span>
              </div>
              <div style={styles.reviewDivider} />

              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Location</span>
                <span style={styles.reviewVal}>📍 {locLabel}</span>
              </div>
              <div style={styles.reviewDivider} />

              <div style={{ padding: "10px 0" }}>
                <span style={styles.reviewLabel}>Description</span>
                <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 6, opacity: 0.85 }}>
                  {description}
                </p>
              </div>
              <div style={styles.reviewDivider} />

              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Reported by</span>
                <span style={styles.reviewVal}>
                  {anonymous ? "Anonymous" : `@${user?.username}`}
                </span>
              </div>
            </div>

            {/* disclaimer */}
            <p style={styles.disclaimer}>
              By submitting, you confirm this report is accurate to the best of your knowledge.
              False reports may result in account suspension.
            </p>
          </div>
        )}

        {/* ── ERROR ── */}
        {err && (
          <div style={styles.error}>{err}</div>
        )}

        {/* ── NAVIGATION BUTTONS ── */}
        <div style={styles.navRow}>
          {step > 1 ? (
            <button style={styles.backBtn} onClick={() => { setErr(""); setStep((s) => s - 1); }}>
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button style={styles.nextBtn} onClick={next}>
              Continue →
            </button>
          ) : (
            <button
              style={{ ...styles.nextBtn, opacity: loading ? 0.7 : 1 }}
              onClick={submit}
              disabled={loading}
            >
              {loading ? <Spinner /> : "🚨 Submit Report"}
            </button>
          )}
        </div>
      </div>
    </Overlay>
  );
}

/* ── STEP BAR ── */
function StepBar({ current, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done   = current > n;
        const active = current === n;
        return (
          <>
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 22, height: 22,
                borderRadius: "50%",
                background: done ? "var(--green)" : active ? "var(--red)" : "var(--dark5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
                color: done || active ? "#fff" : "var(--muted)",
                transition: "background .3s",
                flexShrink: 0,
              }}>
                {done ? "✓" : n}
              </div>
              <span style={{
                fontSize: 12,
                color: active ? "var(--text)" : done ? "var(--green)" : "var(--muted)",
                fontWeight: active ? 600 : 400,
                transition: "color .3s",
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1,
                background: done ? "var(--green)" : "var(--border)",
                transition: "background .3s",
              }} />
            )}
          </>
        );
      })}
    </div>
  );
}

/* ── STYLES ── */
const styles = {
  modal: {
    width: "100%",
    maxWidth: 520,
    background: "var(--dark3)",
    border: "1px solid var(--border2)",
    borderRadius: "var(--r-xl)",
    padding: "28px 28px 20px",
    position: "relative",
    boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  closeBtn: {
    position: "absolute", top: 16, right: 16,
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
  stepWrap: { display: "flex", flexDirection: "column", gap: 0 },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: 22, fontWeight: 800,
    letterSpacing: "-0.3px", marginBottom: 6,
  },
  sub: {
    fontSize: 13, color: "var(--muted)",
    marginBottom: 20, lineHeight: 1.5,
  },
  sectionLabel: {
    fontSize: 12, fontWeight: 600,
    color: "var(--muted2)", letterSpacing: "0.05em",
    textTransform: "uppercase", marginBottom: 10,
  },
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  catBtn: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 5, padding: "10px 6px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "var(--dark4)",
    cursor: "pointer",
    transition: "all .2s",
    color: "var(--muted)",
  },
  catBtnActive: {
    borderColor: "var(--red)",
    background: "rgba(232,64,42,0.1)",
    color: "var(--text)",
  },
  catIcon: { fontSize: 20 },
  catLabel: { fontSize: 10, fontWeight: 600, textAlign: "center" },
  sevRow: { display: "flex", flexDirection: "column", gap: 8 },
  sevBtn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "var(--dark4)",
    cursor: "pointer",
    transition: "all .2s",
    color: "var(--text)",
    textAlign: "left",
  },
  textarea: {
    width: "100%",
    background: "var(--dark4)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    resize: "vertical",
    lineHeight: 1.6,
  },
  charCount: {
    fontSize: 11, color: "var(--muted)",
    textAlign: "right", marginTop: 4,
  },
  input: {
    width: "100%",
    background: "var(--dark4)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)",
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    marginBottom: 16,
  },
  mapPicker: {
    width: "100%", height: 160,
    background: "var(--dark2)",
    borderRadius: "var(--r-md)",
    border: "1px solid var(--border)",
    position: "relative",
    overflow: "hidden",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mapGrid: {
    position: "absolute", inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)," +
      "linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
    backgroundSize: "32px 32px",
  },
  centerPin: {
    position: "absolute",
    zIndex: 5,
    transform: "translate(-50%, -100%)",
    left: "50%", top: "55%",
  },
  pinBody: {
    width: 28, height: 28,
    borderRadius: "50% 50% 50% 0",
    transform: "rotate(-45deg)",
    background: "var(--red)",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "2px solid rgba(255,255,255,0.2)",
    boxShadow: "0 3px 12px rgba(232,64,42,0.5)",
  },
  mapHint: {
    position: "absolute", bottom: 8,
    fontSize: 11, color: "var(--muted)",
    background: "rgba(13,15,20,0.8)",
    padding: "3px 10px", borderRadius: 20,
  },
  anonRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "var(--dark4)",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
  },
  toggle: {
    width: 44, height: 24,
    borderRadius: 12, border: "none",
    position: "relative", cursor: "pointer",
    transition: "background .2s", flexShrink: 0,
  },
  toggleKnob: {
    position: "absolute", top: 2,
    width: 20, height: 20,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform .2s",
  },
  reviewCard: {
    background: "var(--dark4)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-md)",
    padding: "4px 16px",
    marginBottom: 16,
  },
  reviewRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
  },
  reviewLabel: {
    fontSize: 12, color: "var(--muted)",
    fontWeight: 500,
  },
  reviewVal: { fontSize: 13, fontWeight: 500 },
  reviewDivider: { height: 1, background: "var(--border)" },
  disclaimer: {
    fontSize: 11, color: "var(--muted)",
    lineHeight: 1.6, marginBottom: 4,
  },
  error: {
    background: "rgba(232,64,42,0.1)",
    border: "1px solid rgba(232,64,42,0.25)",
    borderRadius: "var(--r-sm)",
    padding: "9px 13px",
    fontSize: 13, color: "#f87262",
    marginTop: 12,
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid var(--border)",
  },
  backBtn: {
    padding: "10px 20px",
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--muted)",
    fontSize: 13, cursor: "pointer",
  },
  nextBtn: {
    padding: "10px 28px",
    borderRadius: "var(--r-sm)",
    border: "none",
    background: "var(--red)",
    color: "#fff",
    fontSize: 14, fontWeight: 700,
    fontFamily: "var(--font-display)",
    cursor: "pointer",
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8,
    transition: "opacity .2s",
  },
  successIcon: { fontSize: 52, marginBottom: 16 },
  submitBtn: {
    padding: "11px 32px",
    borderRadius: "var(--r-sm)",
    border: "none", background: "var(--red)",
    color: "#fff", fontSize: 14, fontWeight: 700,
    fontFamily: "var(--font-display)", cursor: "pointer",
  },
};