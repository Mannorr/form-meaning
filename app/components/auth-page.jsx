"use client";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — LOGIN + JOIN PAGE (File 2 of N)
// Covers: Login, Password Reset, Join/Payment via Paystack
// ═══════════════════════════════════════════════════════════════

export default function AuthPage({ initialPage = "login" }) {
  const [theme, setTheme] = useState("light");
  const [activePage, setActivePage] = useState(initialPage); // login | join
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  // ─── Brand Tokens ──────────────────────────────────────────
  const c = dark ? {
    bg: "#111111", bg2: "#1A1A1A", bg3: "#222222",
    surface: "rgba(255,255,255,0.04)", surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    text: "#F5F0EB", textMuted: "rgba(245,240,235,0.6)", textSoft: "rgba(245,240,235,0.35)",
    red: "#E63228", redSoft: "rgba(230,50,40,0.12)", redBorder: "rgba(230,50,40,0.3)",
    mint: "#3EDEB5", mintSoft: "rgba(62,222,181,0.1)", mintBorder: "rgba(62,222,181,0.25)",
    navBg: "rgba(17,17,17,0.88)",
    cardBg: "#1A1A1A",
    inputBg: "#1A1A1A",
    grain: 0.06,
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    navBg: "rgba(245,240,235,0.9)",
    cardBg: "#FFFFFF",
    inputBg: "#FFFFFF",
    grain: 0.04,
  };

  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const sans = { fontFamily: "'Syne', 'Helvetica Neue', sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };

  // ─── Shared Styles ─────────────────────────────────────────
  const maxW = { maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" };
  const btnBase = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "13px 24px", borderRadius: 4, fontSize: 14,
    fontWeight: 600, cursor: "pointer", border: "none",
    transition: "all 0.2s ease", ...sans, letterSpacing: "0.01em",
  };
  const btnRed = { ...btnBase, background: c.red, color: "#fff" };
  const btnOutline = { ...btnBase, background: "transparent", color: c.text, border: `1.5px solid ${c.borderStrong}` };
  const btnGhost = { ...btnBase, background: "transparent", color: c.textMuted, padding: "10px 14px", fontSize: 13 };
  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 4,
    border: `1.5px solid ${c.borderStrong}`, background: c.inputBg,
    color: c.text, fontSize: 14, ...sans, outline: "none",
    transition: "border-color 0.15s ease",
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: c.textSoft, ...mono,
    display: "block", marginBottom: 6, textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  // ─── Icons ─────────────────────────────────────────────────
  const Ico = ({ d, size = 20, sw = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const ArrowR = ({ s = 16 }) => <Ico size={s} d={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>} />;
  const ArrowL = ({ s = 16 }) => <Ico size={s} d={<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>} />;
  const Sun = () => <Ico d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />;
  const Moon = () => <Ico d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />;
  const Lock = ({ s = 16 }) => <Ico size={s} d={<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />;
  const Mail = ({ s = 16 }) => <Ico size={s} d={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>} />;
  const Check = ({ s = 16 }) => <Ico size={s} sw={2.5} d={<polyline points="20 6 9 17 4 12"/>} />;
  const Shield = ({ s = 16 }) => <Ico size={s} d={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>} />;
  const Eye = ({ s = 18 }) => <Ico size={s} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />;
  const EyeOff = ({ s = 18 }) => <Ico size={s} d={<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>} />;

  // ═══════════════════════════════════════════════════════════
  // LOGIN COMPONENT
  // ═══════════════════════════════════════════════════════════
  const LoginView = () => {
    const [mode, setMode] = useState("login"); // login | reset | success
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
      setError("");
      if (!email.trim()) { setError("Enter your email address."); return; }
      if (!password.trim()) { setError("Enter your password."); return; }
      setBusy(true);
      try {
        const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
        const json = await res.json();
        if (!res.ok) { setError(json.error || "Login failed."); setBusy(false); return; }
        setMessage("Login successful. Redirecting…");
        window.location.href = "/dashboard";
      } catch { setError("Network error. Try again."); setBusy(false); }
    };

    const handleReset = async () => {
      setError("");
      if (!email.trim()) { setError("Enter your email address."); return; }
      setBusy(true);
      try {
        const res = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
        const json = await res.json();
        if (!res.ok) { setError(json.error || "Failed to send reset link."); setBusy(false); return; }
        setBusy(false);
        setMode("success");
      } catch { setError("Network error. Try again."); setBusy(false); }
    };

    // ─── Reset Success ───────────────────────────────────────
    if (mode === "success") {
      return (
        <div className="au" style={{
          background: c.cardBg, border: `1px solid ${c.border}`,
          borderRadius: 8, padding: 36, maxWidth: 420, width: "100%",
          textAlign: "center",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", background: c.mintSoft,
            border: `1.5px solid ${c.mintBorder}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20, color: c.mint,
          }}>
            <Mail s={22} />
          </div>
          <h2 style={{ ...serif, fontSize: 22, marginBottom: 8 }}>Check your email</h2>
          <p style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            We sent a password reset link to <strong style={{ color: c.text }}>{email}</strong>.
            Click the link in the email to set a new password.
          </p>
          <button onClick={() => { setMode("login"); setEmail(""); setPassword(""); setError(""); setMessage(""); }} style={{ ...btnOutline, width: "100%", justifyContent: "center" }}>
            <ArrowL s={14} /> Back to login
          </button>
        </div>
      );
    }

    // ─── Reset Form ──────────────────────────────────────────
    if (mode === "reset") {
      return (
        <div className="au" style={{
          background: c.cardBg, border: `1px solid ${c.border}`,
          borderRadius: 8, padding: 36, maxWidth: 420, width: "100%",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 8, background: c.redSoft,
              border: `1px solid ${c.redBorder}`,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16, color: c.red,
            }}>
              <Mail s={20} />
            </div>
            <h2 style={{ ...serif, fontSize: 24, marginBottom: 4 }}>Reset password</h2>
            <p style={{ color: c.textMuted, fontSize: 14 }}>We'll send you a link to reset it</p>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label htmlFor="reset-email" style={labelStyle}>Email address</label>
              <input
                id="reset-email" type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com" style={inputStyle}
                autoComplete="email"
              />
            </div>

            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 4,
                background: c.redSoft, border: `1px solid ${c.redBorder}`,
                color: c.red, fontSize: 13, fontWeight: 500,
              }}>{error}</div>
            )}

            <button onClick={handleReset} disabled={busy} style={{
              ...btnRed, width: "100%", justifyContent: "center",
              opacity: busy ? 0.7 : 1, cursor: busy ? "wait" : "pointer",
            }}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button onClick={() => { setMode("login"); setError(""); }} style={{ ...btnGhost, fontSize: 13, color: c.textMuted }}>
              <ArrowL s={14} /> Back to login
            </button>
          </div>
        </div>
      );
    }

    // ─── Login Form ──────────────────────────────────────────
    return (
      <div className="au" style={{
        background: c.cardBg, border: `1px solid ${c.border}`,
        borderRadius: 8, padding: 36, maxWidth: 420, width: "100%",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 8, background: c.red,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, fontWeight: 800, fontSize: 18, color: "#fff",
            ...sans,
          }}>F</div>
          <h2 style={{ ...serif, fontSize: 24, marginBottom: 4 }}>Welcome back</h2>
          <p style={{ color: c.textMuted, fontSize: 14 }}>Log in to your member account</p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label htmlFor="login-email" style={labelStyle}>Email address</label>
            <input
              id="login-email" type="email" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); setMessage(""); }}
              placeholder="you@example.com" style={inputStyle}
              autoComplete="email"
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <label htmlFor="login-pw" style={labelStyle}>Password</label>
              <button onClick={() => { setMode("reset"); setError(""); setMessage(""); }} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 11, color: c.red, ...mono, fontWeight: 500,
                letterSpacing: "0.04em",
              }}>FORGOT?</button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="login-pw" type={showPw ? "text" : "password"} value={password}
                onChange={e => { setPassword(e.target.value); setError(""); setMessage(""); }}
                placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }}
                autoComplete="current-password"
              />
              <button onClick={() => setShowPw(!showPw)} style={{
                position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: c.textSoft, padding: 8,
              }} aria-label={showPw ? "Hide password" : "Show password"}>
                {showPw ? <EyeOff s={16} /> : <Eye s={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 4,
              background: c.redSoft, border: `1px solid ${c.redBorder}`,
              color: c.red, fontSize: 13, fontWeight: 500,
            }}>{error}</div>
          )}

          {message && (
            <div style={{
              padding: "10px 14px", borderRadius: 4,
              background: c.mintSoft, border: `1px solid ${c.mintBorder}`,
              color: c.mint, fontSize: 13, fontWeight: 500,
            }}>{message}</div>
          )}

          <button onClick={handleLogin} disabled={busy} style={{
            ...btnRed, width: "100%", justifyContent: "center", marginTop: 2,
            opacity: busy ? 0.7 : 1, cursor: busy ? "wait" : "pointer",
          }}>
            {busy ? "Logging in…" : "Log in"}
          </button>
        </div>

        <div style={{
          textAlign: "center", marginTop: 22, paddingTop: 18,
          borderTop: `1px solid ${c.border}`,
        }}>
          <p style={{ color: c.textSoft, fontSize: 13 }}>
            Not a member yet?{" "}
            <button onClick={() => setActivePage("join")} style={{
              background: "none", border: "none", color: c.red,
              cursor: "pointer", fontWeight: 700, ...sans, fontSize: 13,
              textDecoration: "underline", textUnderlineOffset: 3,
            }}>Join here</button>
          </p>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // JOIN / PAYMENT COMPONENT
  // ═══════════════════════════════════════════════════════════
  const JoinView = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const SELAR_URL = "https://selar.com/4781un7771";

    const handlePay = () => {
      setError("");
      if (!name.trim()) { setError("Enter your full name."); return; }
      if (!email.trim() || !email.includes("@")) { setError("Enter a valid email address."); return; }
      setBusy(true);
      // In production: stores name+email in Supabase pending_payments table,
      // then redirects to Selar. Selar webhook confirms and auto-creates account.
      setTimeout(() => { window.open(SELAR_URL, "_blank"); setBusy(false); }, 800);
    };

    return (
      <div className="au" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
        maxWidth: 800, width: "100%", borderRadius: 8, overflow: "hidden",
        border: `1px solid ${c.border}`,
        background: c.cardBg,
      }}>
        {/* Left — What you get */}
        <div className="fm-join-left" style={{
          padding: 36, background: c.red, color: "#fff",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{
            position: "absolute", bottom: -20, left: -20,
            width: 70, height: 70, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              ...mono, fontSize: 11, textTransform: "uppercase",
              letterSpacing: "0.1em", opacity: 0.7, marginBottom: 16,
            }}>Membership</div>

            <h2 style={{ ...serif, fontSize: 28, lineHeight: 1.15, marginBottom: 6 }}>
              Form &<br />Meaning
            </h2>

            <div style={{
              ...serif, fontSize: 36, fontWeight: 700, marginBottom: 24,
              display: "flex", alignItems: "baseline", gap: 8,
            }}>
              ₦5,000
              <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.7, ...sans }}>one-time</span>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {[
                "Full community access",
                "Weekly sessions & critique",
                "Monthly challenges",
                "Resource vault & frameworks",
                "3-day conference videos",
                "Member directory & profiles",
                "WhatsApp community",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ marginTop: 1, opacity: 0.9 }}><Check s={15} /></span>
                  <span style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 28, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12, opacity: 0.6, ...mono,
            }}>
              <Shield s={14} /> Instant access after payment
            </div>
          </div>
        </div>

        {/* Right — Payment form */}
        <div className="fm-join-right" style={{ padding: 36 }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ ...serif, fontSize: 22, marginBottom: 4 }}>Join the community</h3>
            <p style={{ color: c.textMuted, fontSize: 14 }}>
              One payment. No applications. Instant access.
            </p>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label htmlFor="join-name" style={labelStyle}>Full name</label>
              <input
                id="join-name" type="text" value={name}
                onChange={e => { setName(e.target.value); setError(""); }}
                placeholder="Your full name" style={inputStyle}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="join-email" style={labelStyle}>Email address</label>
              <input
                id="join-email" type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com" style={inputStyle}
                autoComplete="email"
              />
              <p style={{ fontSize: 11, color: c.textSoft, marginTop: 6, lineHeight: 1.4, ...mono }}>
                Your login credentials will be sent to this email
              </p>
            </div>

            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 4,
                background: c.redSoft, border: `1px solid ${c.redBorder}`,
                color: c.red, fontSize: 13, fontWeight: 500,
              }}>{error}</div>
            )}

            <button onClick={handlePay} disabled={busy} style={{
              ...btnBase, width: "100%", justifyContent: "center",
              background: dark ? "#fff" : "#111", color: dark ? "#111" : "#fff",
              fontWeight: 700, padding: "14px 24px", marginTop: 2,
              opacity: busy ? 0.7 : 1, cursor: busy ? "wait" : "pointer",
              borderRadius: 4,
            }}>
              {busy ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 16, height: 16, border: "2px solid rgba(128,128,128,0.3)",
                    borderTopColor: dark ? "#111" : "#fff", borderRadius: "50%",
                    animation: "spin 0.6s linear infinite", display: "inline-block",
                  }} />
                  Redirecting to Selar…
                </span>
              ) : (
                <>
                  <Lock s={15} /> Pay ₦5,000 on Selar
                </>
              )}
            </button>

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 12, marginTop: 4,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 11, color: c.textSoft, ...mono,
              }}>
                <Shield s={12} /> Secure payment
              </div>
              <span style={{ color: c.border }}>·</span>
              <div style={{ fontSize: 11, color: c.textSoft, ...mono }}>
                Powered by Selar
              </div>
            </div>
          </div>

          <div style={{
            textAlign: "center", marginTop: 22, paddingTop: 18,
            borderTop: `1px solid ${c.border}`,
          }}>
            <p style={{ color: c.textSoft, fontSize: 13 }}>
              Already a member?{" "}
              <button onClick={() => setActivePage("login")} style={{
                background: "none", border: "none", color: c.red,
                cursor: "pointer", fontWeight: 700, ...sans, fontSize: 13,
                textDecoration: "underline", textUnderlineOffset: 3,
              }}>Log in</button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{
      ...sans, background: c.bg, color: c.text, minHeight: "100vh",
      transition: "background 0.35s ease, color 0.35s ease",
      WebkitFontSmoothing: "antialiased", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${c.red}44; }
        :focus-visible { outline: 2px solid ${c.red}; outline-offset: 3px; }
        input:focus-visible { outline: none; border-color: ${c.red} !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
          content: ""; position: fixed; inset: -100%; width: 300%; height: 300%;
        }
        .au { animation: fadeUp 0.5s ease both; }
        @media (max-width: 640px) {
          .fm-join-grid { grid-template-columns: 1fr !important; }
          .fm-join-left { border-radius: 8px 8px 0 0 !important; }
        }
      `}</style>


      {/* ─── Navbar ─────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: c.navBg, backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${c.border}`,
        transition: "all 0.35s ease",
      }}>
        <div style={{ ...maxW, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer", color: c.text, ...sans,
          }} aria-label="Form & Meaning home">
            <div style={{
              width: 32, height: 32, borderRadius: 3, background: c.red,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 15, color: "#fff",
            }}>F</div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>Form & Meaning</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Page toggle */}
            <div style={{
              display: "flex", borderRadius: 4, border: `1px solid ${c.border}`,
              overflow: "hidden",
            }}>
              <button onClick={() => setActivePage("login")} style={{
                ...btnGhost, borderRadius: 0, padding: "8px 16px", fontSize: 13,
                background: activePage === "login" ? c.redSoft : "transparent",
                color: activePage === "login" ? c.red : c.textMuted,
                fontWeight: activePage === "login" ? 700 : 500,
                border: "none",
              }}>Log in</button>
              <div style={{ width: 1, background: c.border }} />
              <button onClick={() => setActivePage("join")} style={{
                ...btnGhost, borderRadius: 0, padding: "8px 16px", fontSize: 13,
                background: activePage === "join" ? c.redSoft : "transparent",
                color: activePage === "join" ? c.red : c.textMuted,
                fontWeight: activePage === "join" ? 700 : 500,
                border: "none",
              }}>Join</button>
            </div>

            <button onClick={toggle} style={{ ...btnGhost, padding: 8, marginLeft: 4 }} aria-label="Toggle theme">
              {dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Page Content ──────────────────────────────────── */}
      <div style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 24px",
        position: "relative",
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute", top: "15%", left: "5%",
          width: 180, height: 3, background: c.mint, opacity: 0.2,
          transform: "rotate(-12deg)",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "8%",
          width: 120, height: 3, background: c.red, opacity: 0.15,
          transform: "rotate(8deg)",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "15%",
          width: 8, height: 8, borderRadius: "50%",
          border: `2px solid ${c.red}20`,
        }} />

        {activePage === "login" ? <LoginView /> : <JoinView />}
      </div>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${c.border}`, padding: "24px",
        background: c.surface, textAlign: "center",
      }}>
        <p style={{ fontSize: 12, color: c.textSoft, ...mono }}>
          Form & Meaning · Design is not decoration. It's a decision. · © 2026
        </p>
      </footer>
    </div>
  );
}
