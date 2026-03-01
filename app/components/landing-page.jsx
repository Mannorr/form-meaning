"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — LANDING PAGE (File 1 of N)
// Brand: Editorial / Bold / Conference poster aesthetic
// Colors: Red, Mint Green, Off-white, Black
// ═══════════════════════════════════════════════════════════════

export default function LandingPage() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [subModal, setSubModal] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subName, setSubName] = useState("");
  const [toast, setToast] = useState(null);
  const heroRef = useRef(null);

  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  // ─── Brand Tokens ──────────────────────────────────────────
  const c = dark ? {
    bg: "#111111", bg2: "#1A1A1A", bg3: "#222222",
    surface: "rgba(255,255,255,0.04)", surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    text: "#F5F0EB", textMuted: "rgba(245,240,235,0.6)", textSoft: "rgba(245,240,235,0.35)",
    red: "#E63228", redSoft: "rgba(230,50,40,0.12)", redBorder: "rgba(230,50,40,0.3)",
    mint: "#3EDEB5", mintSoft: "rgba(62,222,181,0.1)", mintBorder: "rgba(62,222,181,0.25)",
    cream: "#F5F0EB",
    navBg: "rgba(17,17,17,0.88)",
    grain: 0.06,
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    cream: "#F5F0EB",
    navBg: "rgba(245,240,235,0.9)",
    grain: 0.04,
  };

  // ─── Typography ────────────────────────────────────────────
  const serif = { fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" };
  const sans = { fontFamily: "'Syne', 'Helvetica Neue', Arial, sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', 'SF Mono', monospace" };

  // ─── Shared Styles ─────────────────────────────────────────
  const maxW = { maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" };
  const btnBase = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "13px 24px", borderRadius: 4, fontSize: 14,
    fontWeight: 600, cursor: "pointer", border: "none",
    transition: "all 0.2s ease", ...sans, letterSpacing: "0.01em",
    textDecoration: "none",
  };
  const btnRed = { ...btnBase, background: c.red, color: "#fff" };
  const btnMint = { ...btnBase, background: c.mint, color: "#111" };
  const btnOutline = {
    ...btnBase, background: "transparent", color: c.text,
    border: `1.5px solid ${c.borderStrong}`,
  };
  const btnGhost = {
    ...btnBase, background: "transparent", color: c.textMuted,
    padding: "10px 14px", fontSize: 13,
  };
  const inputBase = {
    width: "100%", padding: "13px 16px", borderRadius: 4,
    border: `1.5px solid ${c.borderStrong}`, background: dark ? c.bg2 : "#fff",
    color: c.text, fontSize: 14, ...sans, outline: "none",
    transition: "border-color 0.15s ease",
  };

  // ─── SVG Icons ─────────────────────────────────────────────
  const Ico = ({ d, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const ArrowR = ({ s = 18 }) => <Ico size={s} d={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>} />;
  const Sun = () => <Ico d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />;
  const Moon = () => <Ico d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />;
  const Menu = () => <Ico size={22} d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
  const X = () => <Ico size={22} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
  const Check = ({ s = 16 }) => <Ico size={s} d={<polyline points="20 6 9 17 4 12"/>} />;
  const Zap = () => <Ico size={16} d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>} />;

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{
      ...sans, background: c.bg, color: c.text, minHeight: "100vh",
      transition: "background 0.35s ease, color 0.35s ease",
      WebkitFontSmoothing: "antialiased", position: "relative", overflow: "hidden",
    }}>
      {/* ─── GLOBAL STYLES ──────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::selection { background: ${c.red}44; color: ${c.text}; }
        :focus-visible { outline: 2px solid ${c.red}; outline-offset: 3px; }
        input:focus-visible, textarea:focus-visible { outline: none; border-color: ${c.red} !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes grain { 0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}20%{transform:translate(-15%,5%)}30%{transform:translate(7%,-25%)}40%{transform:translate(-5%,25%)}50%{transform:translate(-15%,10%)}60%{transform:translate(15%,0%)}70%{transform:translate(0%,15%)}80%{transform:translate(3%,35%)}90%{transform:translate(-10%,10%)}}
        .fm-grain::before {
          content: ""; position: fixed; inset: -100%; width: 300%; height: 300%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: ${c.grain}; pointer-events: none; z-index: 1000;
          animation: grain 3s steps(6) infinite;
        }
        .au { animation: fadeUp 0.55s ease both; }
        .au1 { animation: fadeUp 0.55s ease 0.07s both; }
        .au2 { animation: fadeUp 0.55s ease 0.14s both; }
        .au3 { animation: fadeUp 0.55s ease 0.21s both; }
        .au4 { animation: fadeUp 0.55s ease 0.28s both; }
        .au5 { animation: fadeUp 0.55s ease 0.35s both; }
        .fm-link { text-decoration: none; color: inherit; }
        .fm-link:hover { opacity: 0.8; }
        @media (max-width: 768px) {
          .fm-desk { display: none !important; }
          .fm-mob { display: flex !important; }
          .fm-hero-grid { grid-template-columns: 1fr !important; }
          .fm-split { grid-template-columns: 1fr !important; }
          .fm-g3 { grid-template-columns: 1fr !important; }
          .fm-hero-title { font-size: 42px !important; }
          .fm-marquee-text { font-size: 48px !important; }
        }
        @media (max-width: 480px) {
          .fm-hero-title { font-size: 34px !important; }
          .fm-marquee-text { font-size: 36px !important; }
          .fm-btn-row { flex-direction: column; }
          .fm-btn-row > * { width: 100%; justify-content: center; text-align: center; }
        }
      `}</style>

      {/* Grain overlay */}
      <div className="fm-grain" />

      {/* ═══ NAVBAR ═══════════════════════════════════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: c.navBg, backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${c.border}`,
        transition: "all 0.35s ease",
      }}>
        <div style={{ ...maxW, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo placeholder */}
          <button onClick={() => scrollTo("top")} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer", color: c.text,
            ...sans,
          }} aria-label="Form & Meaning home">
            <div style={{
              width: 32, height: 32, borderRadius: 3, background: c.red,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: "-0.02em",
            }}>F</div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>
              Form & Meaning
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="fm-desk" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => scrollTo("why")} style={btnGhost}>Why</button>
            <button onClick={() => scrollTo("events")} style={btnGhost}>Events</button>
            <button onClick={() => scrollTo("community")} style={btnGhost}>Community</button>
            <span style={{ width: 1, height: 20, background: c.border, margin: "0 6px" }} />
            <button onClick={() => window.location.href="/login"} style={{ ...btnGhost, color: c.text, fontWeight: 600 }}>Log in</button>
            <button onClick={() => window.location.href="/join"} style={{ ...btnRed, padding: "9px 18px", fontSize: 13 }}>
              Join — ₦5,000
            </button>
            <button onClick={toggle} style={{
              ...btnGhost, padding: 8, borderRadius: 4, marginLeft: 2,
            }} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
              {dark ? <Sun /> : <Moon />}
            </button>
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="fm-mob" style={{ display: "none", alignItems: "center", gap: 4 }}>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }} aria-label="Toggle theme">
              {dark ? <Sun /> : <Moon />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ ...btnGhost, padding: 8 }} aria-label="Menu">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: "fixed", inset: 0, top: 60, zIndex: 99,
            background: c.bg, padding: "32px 24px",
            display: "flex", flexDirection: "column", gap: 6,
            animation: "fadeIn 0.2s ease",
          }}>
            {["why","events","community"].map(s => (
              <button key={s} onClick={() => scrollTo(s)} style={{
                ...btnGhost, fontSize: 18, padding: "16px 8px", width: "100%",
                justifyContent: "flex-start", textTransform: "capitalize",
              }}>{s}</button>
            ))}
            <div style={{ height: 1, background: c.border, margin: "8px 0" }} />
            <button onClick={() => window.location.href="/login"} style={{ ...btnGhost, fontSize: 18, padding: "16px 8px", width: "100%", justifyContent: "flex-start", fontWeight: 600 }}>Log in</button>
            <button onClick={() => window.location.href="/join"} style={{ ...btnRed, width: "100%", justifyContent: "center", marginTop: 8, fontSize: 16, padding: "16px 24px" }}>
              Join — ₦5,000
            </button>
          </div>
        )}
      </header>

      {/* ═══ HERO ═════════════════════════════════════════════ */}
      <section id="top" ref={heroRef} style={{ position: "relative", overflow: "hidden" }}>
        {/* Decorative red block */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: "35%", height: "100%",
          background: c.red, opacity: dark ? 0.07 : 0.05, zIndex: 0,
        }} />
        {/* Decorative mint accent */}
        <div style={{
          position: "absolute", bottom: 60, left: "10%", width: 200, height: 4,
          background: c.mint, opacity: 0.5, zIndex: 0,
        }} />

        <div style={{ ...maxW, position: "relative", zIndex: 1, padding: "80px 24px 60px" }}>
          <div className="fm-hero-grid" style={{
            display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start",
          }}>
            {/* Left */}
            <div>
              <div className="au" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 14px 6px 8px", borderRadius: 3,
                background: c.redSoft, border: `1px solid ${c.redBorder}`,
                fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.1em", color: c.red, ...mono,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%", background: c.red,
                  boxShadow: `0 0 0 3px ${c.redSoft}`,
                }} />
                For designers, thinkers & creative leaders
              </div>

              <h1 className="au1 fm-hero-title" style={{
                ...serif, fontSize: 56, lineHeight: 1.04, letterSpacing: "-0.03em",
                marginTop: 24, fontWeight: 700,
              }}>
                Design is not<br />
                decoration. It's a<br />
                <span style={{
                  color: c.red, fontStyle: "italic", position: "relative",
                }}>
                  decision
                  <svg style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 8 }} viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0 5 Q50 0 100 5 Q150 9 200 4" stroke={c.mint} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>.
              </h1>

              <p className="au2" style={{
                color: c.textMuted, fontSize: 17, lineHeight: 1.7,
                maxWidth: 480, marginTop: 24,
              }}>
                A community for problem solvers who use design as their tool.
                We celebrate thinking over output, clarity over speed, and work
                that actually means something.
              </p>

              <div className="au3 fm-btn-row" style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
                <button onClick={() => window.location.href="/join"} style={btnRed}>
                  Join the community <ArrowR s={16} />
                </button>
                <button onClick={() => scrollTo("why")} style={btnOutline}>
                  Why we exist
                </button>
              </div>

              {/* Stats */}
              <div className="au4" style={{
                display: "flex", gap: 36, marginTop: 48, flexWrap: "wrap",
              }}>
                {[
                  { num: "30+", label: "Members" },
                  { num: "Weekly", label: "Sessions" },
                  { num: "3 Days", label: "Conference" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ ...serif, fontSize: 24, fontWeight: 700, color: c.red }}>{s.num}</div>
                    <div style={{ fontSize: 12, color: c.textSoft, letterSpacing: "0.04em", marginTop: 2, textTransform: "uppercase", ...mono }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — sidebar cards */}
            <aside className="au2" style={{
              display: "grid", gap: 12,
            }}>
              {/* Conference card */}
              <div style={{
                background: c.red, borderRadius: 6, padding: 22, color: "#fff",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -20, right: -20, width: 80, height: 80,
                  borderRadius: "50%", background: "rgba(255,255,255,0.1)",
                }} />
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8, ...mono, marginBottom: 10 }}>Conference</div>
                <div style={{ ...serif, fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
                  3-Day Design Conference
                </div>
                <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 14 }}>
                  Mannorr · Petra · Thizkid · Dexios
                </div>
                <div style={{
                  display: "inline-block", padding: "5px 12px", borderRadius: 3,
                  background: "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 600,
                  ...mono,
                }}>
                  Feb 19–21, 2026
                </div>
              </div>

              {/* Values card */}
              <div style={{
                background: c.surface, border: `1px solid ${c.border}`,
                borderRadius: 6, padding: 22,
              }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textSoft, ...mono, marginBottom: 12 }}>What we value</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {["Form — How it's made", "Meaning — Why it matters", "Integrity — Who it serves"].map((v, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ color: c.mint }}><Check s={14} /></span>
                      <span style={{ fontSize: 13, color: c.textMuted }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stay close */}
              <div style={{
                background: c.mintSoft, border: `1px solid ${c.mintBorder}`,
                borderRadius: 6, padding: 22,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Stay close</div>
                <div style={{ fontSize: 13, color: c.textMuted, marginBottom: 12, lineHeight: 1.5 }}>
                  Not ready? Join the list for session invites and openings.
                </div>
                <button onClick={() => setSubModal(true)} style={{
                  ...btnBase, background: c.mint, color: "#111", fontSize: 13,
                  padding: "9px 16px", width: "100%", justifyContent: "center",
                }}>
                  Join the list
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ══════════════════════════════════════════ */}
      <div style={{
        borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`,
        overflow: "hidden", padding: "18px 0", background: c.surface,
      }}>
        <div style={{
          display: "flex", whiteSpace: "nowrap",
          animation: "marquee 25s linear infinite",
          width: "fit-content",
        }}>
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="fm-marquee-text" style={{
              ...serif, fontSize: 56, fontWeight: 700, fontStyle: "italic",
              letterSpacing: "-0.02em", opacity: dark ? 0.06 : 0.08,
              marginRight: 80, userSelect: "none",
            }}>
              Think before you design — Form & Meaning — Think before you design — Form & Meaning —
            </span>
          ))}
        </div>
      </div>

      {/* ═══ WHY THIS EXISTS ══════════════════════════════════ */}
      <section id="why" style={{ padding: "80px 24px" }}>
        <div style={maxW}>
          <div className="fm-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <div style={{
                fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em",
                color: c.red, ...mono, fontWeight: 600, marginBottom: 12,
              }}>Why this exists</div>
              <h2 style={{ ...serif, fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Most creative spaces celebrate output.<br />
                <span style={{ fontStyle: "italic", color: c.red }}>We celebrate thinking.</span>
              </h2>
              <p style={{ color: c.textMuted, fontSize: 16, lineHeight: 1.7, marginTop: 20, maxWidth: 460 }}>
                Everyone's making things. Posting things. Shipping things. But very few people
                are stopping to ask <em>why</em>. Form & Meaning exists because those questions matter.
              </p>
              <p style={{ color: c.textMuted, fontSize: 16, lineHeight: 1.7, marginTop: 12, maxWidth: 460 }}>
                The difference between a creative who executes and one who leads isn't talent.
                It's thinking. Design is just the tool. The real craft is the clarity behind it.
              </p>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {[
                { title: "Depth over noise", desc: "Real thinking, real critique, real improvement. The kind that changes how you approach every problem, not just the next project.", color: c.red },
                { title: "Systems over vibes", desc: "Inspiration fades. Systems don't. We document how we think and how we work so quality becomes repeatable, not accidental.", color: c.mint },
                { title: "Integrity over hype", desc: "We care about what our work does to people. Not just how it looks, but how it influences. That responsibility is the whole point.", color: c.red },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: 22, borderRadius: 6,
                  border: `1px solid ${c.border}`,
                  background: c.surface,
                  borderLeft: `3px solid ${item.color}`,
                }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═════════════════════════════════════ */}
      <section style={{ padding: "60px 24px 80px", background: c.surface, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div style={maxW}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: c.mint, ...mono, fontWeight: 600, marginBottom: 12 }}>Simple process</div>
            <h2 style={{ ...serif, fontSize: 36, letterSpacing: "-0.02em" }}>How it works</h2>
            <p style={{ color: c.textMuted, fontSize: 15, marginTop: 8 }}>No applications. No waiting. Pay and you're in.</p>
          </div>

          <div className="fm-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { step: "01", title: "Pay & get instant access", desc: "One payment. Your account is created automatically and you're in.", icon: "💳" },
              { step: "02", title: "Go through onboarding", desc: "Learn what we stand for, the rules, and watch the 3-day conference.", icon: "📖" },
              { step: "03", title: "Engage & grow", desc: "Weekly sessions, monthly challenges, resources, critique, community.", icon: "🔥" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 28, borderRadius: 6, background: dark ? c.bg : "#fff",
                border: `1px solid ${c.border}`,
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: 20, right: 20,
                  ...serif, fontSize: 48, fontWeight: 700, color: c.red,
                  opacity: 0.1, lineHeight: 1,
                }}>{item.step}</div>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{item.title}</div>
                <div style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LAYERS ═══════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={maxW}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: c.red, ...mono, fontWeight: 600, marginBottom: 12 }}>Built in layers</div>
            <h2 style={{ ...serif, fontSize: 36, letterSpacing: "-0.02em" }}>Three tiers of growth</h2>
          </div>

          <div className="fm-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { layer: "01", title: "Open Community", price: "Free", desc: "Weekly reflections, shared resources, Q&A, honest feedback. A space to think alongside others who care.", color: c.mint, borderColor: c.mintBorder },
              { layer: "02", title: "Mentorship Circle", price: "₦5,000", desc: "Monthly live calls, portfolio guidance, accountability, and direction. Small by design. Focused by choice.", color: c.red, borderColor: c.redBorder, featured: true },
              { layer: "03", title: "Intensives", price: "Coming soon", desc: "Problem-solving frameworks, brand thinking, systems, creative leadership. Short. Sharp. Built to stick.", color: c.textSoft, borderColor: c.border },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 28, borderRadius: 6,
                border: `1px solid ${item.borderColor}`,
                background: item.featured ? (dark ? "rgba(230,50,40,0.06)" : "rgba(212,43,34,0.03)") : c.surface,
                position: "relative", overflow: "hidden",
              }}>
                {item.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.red }} />}
                <div style={{
                  ...mono, fontSize: 11, fontWeight: 600, color: item.color,
                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14,
                }}>Layer {item.layer}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{item.title}</div>
                <div style={{ ...serif, fontSize: 24, color: item.color, marginBottom: 14 }}>{item.price}</div>
                <div style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.65 }}>{item.desc}</div>
                {item.featured && (
                  <button onClick={() => window.location.href="/join"} style={{ ...btnRed, marginTop: 18, width: "100%", justifyContent: "center", fontSize: 13, padding: "11px 20px" }}>
                    Join now <ArrowR s={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EVENTS ═══════════════════════════════════════════ */}
      <section id="events" style={{ padding: "60px 24px 80px", background: c.surface, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <div style={maxW}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: c.mint, ...mono, fontWeight: 600, marginBottom: 12 }}>Events</div>
              <h2 style={{ ...serif, fontSize: 36, letterSpacing: "-0.02em" }}>Where thinking happens out loud</h2>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {[
              { title: "Designing with Intention", date: "Mar 14, 2026", time: "6 PM WAT", type: "Workshop" },
              { title: "The Brief Behind the Brief", date: "Mar 21, 2026", time: "6 PM WAT", type: "Q&A" },
              { title: "Portfolio as Proof", date: "Apr 4, 2026", time: "5 PM WAT", type: "Masterclass" },
            ].map((ev, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "20px 24px", borderRadius: 6,
                background: dark ? c.bg : "#fff", border: `1px solid ${c.border}`,
                gap: 16, flexWrap: "wrap",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 200 }}>
                  <div style={{
                    padding: "5px 10px", borderRadius: 3, fontSize: 11, fontWeight: 600,
                    ...mono, textTransform: "uppercase", letterSpacing: "0.04em",
                    background: i === 0 ? c.redSoft : c.mintSoft,
                    color: i === 0 ? c.red : c.mint,
                    border: `1px solid ${i === 0 ? c.redBorder : c.mintBorder}`,
                  }}>{ev.type}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{ev.title}</div>
                    <div style={{ fontSize: 12, color: c.textSoft, marginTop: 2, ...mono }}>{ev.date} · {ev.time}</div>
                  </div>
                </div>
                <button onClick={() => window.location.href="/join"} style={{ ...btnOutline, padding: "8px 16px", fontSize: 13 }}>
                  Members only
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY PREVIEW ════════════════════════════════ */}
      <section id="community" style={{ padding: "80px 24px" }}>
        <div style={maxW}>
          <div className="fm-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: c.red, ...mono, fontWeight: 600, marginBottom: 12 }}>Community</div>
              <h2 style={{ ...serif, fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                This isn't another<br />
                <span style={{ fontStyle: "italic" }}>group chat.</span>
              </h2>
              <p style={{ color: c.textMuted, fontSize: 16, lineHeight: 1.7, marginTop: 20, maxWidth: 440 }}>
                It's a space with rhythm and intention. Weekly sessions to sharpen your thinking.
                Monthly challenges to push growth. A vault of resources built from real experience.
              </p>
              <p style={{ color: c.textMuted, fontSize: 16, lineHeight: 1.7, marginTop: 12, maxWidth: 440 }}>
                If you're looking for a room where the standard is high, the questions are real,
                and the people are honest — you'll feel at home.
              </p>
              <div className="fm-btn-row" style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <button onClick={() => window.location.href="/join"} style={btnRed}>Join for ₦5,000 <ArrowR s={16} /></button>
                <button onClick={() => setSubModal(true)} style={btnOutline}>Stay close</button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Weekly sessions — deep dives, Q&A, honest critique",
                "Monthly challenges — focused, structured, skill-building",
                "Resource vault — frameworks, notes, curated references",
                "Mentor rooms — conversations with people who've done the work",
                "Member directory — creatives who build with integrity",
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  padding: "14px 18px", borderRadius: 6,
                  background: c.surface, border: `1px solid ${c.border}`,
                }}>
                  <span style={{ color: c.mint, marginTop: 1, flexShrink: 0 }}><Check s={16} /></span>
                  <span style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ════════════════════════════════════════ */}
      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{
          ...maxW, padding: "52px 40px", borderRadius: 6,
          background: c.red, color: "#fff", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -30, left: -30, width: 120, height: 120,
            borderRadius: "50%", background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{
            position: "absolute", bottom: -40, right: -20, width: 160, height: 160,
            borderRadius: "50%", background: "rgba(255,255,255,0.05)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ ...serif, fontSize: 32, lineHeight: 1.15 }}>Ready to think deeper?</h2>
            <p style={{ opacity: 0.85, marginTop: 10, maxWidth: 420, margin: "10px auto 0", fontSize: 15, lineHeight: 1.6 }}>
              Join a room where the standard is high and the work matters.
              No applications. One payment. Instant access.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
              <button onClick={() => window.location.href="/join"} style={{ ...btnBase, background: "#fff", color: c.red, fontWeight: 700 }}>
                Join — ₦5,000 <ArrowR s={16} />
              </button>
              <button onClick={() => setSubModal(true)} style={{ ...btnBase, background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
                Stay close
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══════════════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${c.border}`, padding: "36px 24px",
        background: c.surface,
      }}>
        <div style={{ ...maxW, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Form & Meaning</div>
            <div style={{ fontSize: 12, color: c.textSoft, marginTop: 2, ...mono }}>Design is not decoration. It's a decision.</div>
          </div>
          <div style={{ fontSize: 12, color: c.textSoft, ...mono }}>© 2026</div>
        </div>
      </footer>

      {/* ═══ SUBSCRIBE MODAL ══════════════════════════════════ */}
      {subModal && (
        <div onClick={(e) => e.target === e.currentTarget && setSubModal(false)} style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, animation: "fadeIn 0.2s ease",
        }} role="dialog" aria-modal="true" aria-label="Subscribe">
          <div style={{
            width: "100%", maxWidth: 440, borderRadius: 8,
            background: dark ? c.bg2 : "#fff",
            border: `1px solid ${c.borderStrong}`, padding: 32,
            boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ ...serif, fontSize: 22 }}>Stay close</h3>
              <button onClick={() => setSubModal(false)} style={{ ...btnGhost, padding: 6 }} aria-label="Close"><X /></button>
            </div>
            <p style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Not ready to join? We'll share thoughts, session invites,
              and openings when they happen. No spam.
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: c.textSoft, ...mono, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</label>
                <input type="text" value={subName} onChange={e => setSubName(e.target.value)} placeholder="Your name" style={inputBase} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: c.textSoft, ...mono, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                <input type="email" value={subEmail} onChange={e => setSubEmail(e.target.value)} placeholder="you@example.com" style={inputBase} />
              </div>
              <button onClick={async () => {
                if (!subEmail.trim()) { showToast("Enter your email."); return; }
                try {
                  const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: subName.trim(), email: subEmail.trim() }) });
                  if (!res.ok) { const j = await res.json(); showToast(j.error || "Something went wrong."); return; }
                  setSubModal(false); showToast("Subscribed — welcome to the list."); setSubName(""); setSubEmail("");
                } catch { showToast("Network error. Try again."); }
              }} style={{ ...btnRed, width: "100%", justifyContent: "center", marginTop: 4 }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOAST ════════════════════════════════════════════ */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 300,
          padding: "14px 20px", borderRadius: 6,
          background: dark ? c.bg2 : "#fff", color: c.text,
          border: `1px solid ${c.mintBorder}`,
          boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          animation: "fadeUp 0.3s ease", fontSize: 14, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8, maxWidth: 360,
        }}>
          <span style={{ color: c.mint }}><Check /></span>
          {toast}
        </div>
      )}
    </div>
  );
}
