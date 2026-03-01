"use client";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — MEMBER DASHBOARD (File 3 of N)
// The home base for logged-in members
// ═══════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  // ─── Mock Data ─────────────────────────────────────────────
  const user = { name: "Mannorr", email: "ag.oluwanifemi@gmail.com", discipline: "Visual & Brand Design" };

  const [events, setEvents] = useState([
    { id: 1, title: "Designing with Intention", date: "Mar 14", time: "6 PM WAT", type: "Workshop", rsvpd: false },
    { id: 2, title: "The Brief Behind the Brief", date: "Mar 21", time: "6 PM WAT", type: "Q&A", rsvpd: true },
    { id: 3, title: "Portfolio as Proof", date: "Apr 4", time: "5 PM WAT", type: "Masterclass", rsvpd: false },
  ]);
  const toggleRsvp = (id) => setEvents(evs => evs.map(e => e.id === id ? { ...e, rsvpd: !e.rsvpd } : e));

  const announcements = [
    { id: 1, title: "March Challenge: Redesign a Public Service", body: "Pick any government or public service and redesign one touchpoint. Focus on the thinking, not the polish. Share your process in the community.", date: "Mar 1, 2026", pinned: true },
    { id: 2, title: "Conference recordings now in the library", body: "All three days are uploaded. If you haven't watched them yet, start with Day 1 — it sets the foundation for everything else we do here.", date: "Feb 28, 2026", pinned: false },
    { id: 3, title: "New resource: Problem-Solving Framework", body: "A structured set of questions to ask before you open any design tool. Print it. Pin it. Use it on every project.", date: "Feb 25, 2026", pinned: false },
  ];

  const newMembers = [
    { name: "Praise Max-Oti", discipline: "Brand Design" },
    { name: "Joshua Ibiyinka", discipline: "UI/UX Design" },
    { name: "Kosi Okoye", discipline: "Motion Design" },
    { name: "Anita Ojone Ogu", discipline: "Visual Design" },
  ];

  const recentContent = [
    { title: "The Problem You Were Hired to Solve", speaker: "Mannorr", type: "Conference", tag: "Day 1" },
    { title: "Problem-Solving Framework", speaker: "Form & Meaning", type: "Resource", tag: "New" },
  ];

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
    grain: 0.04,
  };

  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const sans = { fontFamily: "'Syne', 'Helvetica Neue', sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };

  const maxW = { maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" };
  const btnBase = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "10px 18px", borderRadius: 4, fontSize: 13,
    fontWeight: 600, cursor: "pointer", border: "none",
    transition: "all 0.2s ease", ...sans, letterSpacing: "0.01em",
  };
  const btnRed = { ...btnBase, background: c.red, color: "#fff" };
  const btnOutline = { ...btnBase, background: "transparent", color: c.text, border: `1.5px solid ${c.borderStrong}` };
  const btnGhost = { ...btnBase, background: "transparent", color: c.textMuted, padding: "8px 12px", fontSize: 13 };
  const cardStyle = {
    background: c.cardBg, border: `1px solid ${c.border}`,
    borderRadius: 8, padding: 22, transition: "all 0.15s ease",
  };

  // ─── Icons ─────────────────────────────────────────────────
  const Ico = ({ d, size = 20, sw = 2, fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const ArrowR = ({ s = 14 }) => <Ico size={s} d={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>} />;
  const Sun = () => <Ico d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />;
  const Moon = () => <Ico d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />;
  const Check = ({ s = 14 }) => <Ico size={s} sw={2.5} d={<polyline points="20 6 9 17 4 12"/>} />;
  const MenuIco = () => <Ico size={22} d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
  const XIco = () => <Ico size={22} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
  const PinIco = ({ s = 14 }) => <Ico size={s} fill="currentColor" sw={0} d={<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>} />;
  const HomeIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />;
  const BookIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>} />;
  const UsersIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />;
  const CalIco = ({ s = 16 }) => <Ico size={s} d={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />;
  const UserIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />;
  const LogoutIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />;
  const MegaIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>} />;
  const PlayIco = ({ s = 14 }) => <Ico size={s} fill="currentColor" sw={0} d={<polygon points="5 3 19 12 5 21 5 3"/>} />;

  // ─── Avatar ────────────────────────────────────────────────
  const Avatar = ({ name, size = 40 }) => {
    const colors = ["#E63228","#3EDEB5","#D4A843","#4A6FD9","#9B6FCF","#E07BAC","#5CB8B2","#D46B5D"];
    const idx = name.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % colors.length;
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", background: colors[idx],
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 700, color: "#fff", flexShrink: 0,
        letterSpacing: "0.01em", ...sans,
      }}>{initials}</div>
    );
  };

  // ─── Nav Items ─────────────────────────────────────────────
  const navLinks = [
    { key: "dashboard", label: "Dashboard", icon: <HomeIco /> },
    { key: "library", label: "Library", icon: <BookIco /> },
    { key: "community", label: "Community", icon: <UsersIco /> },
    { key: "events", label: "Events", icon: <CalIco /> },
  ];

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
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes grain { 0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(7%,-25%)}50%{transform:translate(-15%,10%)}70%{transform:translate(0%,15%)}90%{transform:translate(-10%,10%)}}
        .fm-grain::before {
          content:""; position:fixed; inset:-100%; width:300%; height:300%;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:${c.grain}; pointer-events:none; z-index:1000;
          animation:grain 3s steps(6) infinite;
        }
        .au { animation: fadeUp 0.5s ease both; }
        .au1 { animation: fadeUp 0.5s ease 0.06s both; }
        .au2 { animation: fadeUp 0.5s ease 0.12s both; }
        .au3 { animation: fadeUp 0.5s ease 0.18s both; }
        .au4 { animation: fadeUp 0.5s ease 0.24s both; }
        .fm-hover-card { transition: border-color 0.15s ease, transform 0.15s ease; }
        .fm-hover-card:hover { border-color: ${c.borderStrong} !important; transform: translateY(-1px); }
        .fm-sidebar-btn { transition: background 0.12s ease; border: none; }
        .fm-sidebar-btn:hover { background: ${c.surfaceHover} !important; }
        @media (max-width: 900px) {
          .fm-dash-grid { grid-template-columns: 1fr !important; }
          .fm-desk-nav { display: none !important; }
          .fm-mob-toggle { display: flex !important; }
        }
        @media (min-width: 901px) {
          .fm-mob-toggle { display: none !important; }
        }
      `}</style>

      <div className="fm-grain" />

      {/* ═══ NAVBAR ═══════════════════════════════════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: c.navBg, backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${c.border}`, transition: "all 0.35s ease",
      }}>
        <div style={{ ...maxW, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo */}
          <button style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer", color: c.text, ...sans,
          }} aria-label="Home">
            <div style={{
              width: 32, height: 32, borderRadius: 3, background: c.red,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 15, color: "#fff",
            }}>F</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Form & Meaning</div>
              <div style={{ fontSize: 10, color: c.textSoft, letterSpacing: "0.03em" }}>Member area</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="fm-desk-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(link => (
              <button key={link.key} style={{
                ...btnGhost,
                color: link.key === "dashboard" ? c.red : c.textMuted,
                fontWeight: link.key === "dashboard" ? 700 : 500,
                gap: 6,
              }}>
                <span style={{ color: link.key === "dashboard" ? c.red : c.textSoft }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
            <span style={{ width: 1, height: 20, background: c.border, margin: "0 6px" }} />
            <button style={{ ...btnGhost, padding: "4px 8px" }} aria-label="Profile">
              <Avatar name={user.name} size={32} />
            </button>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }} aria-label="Toggle theme">
              {dark ? <Sun /> : <Moon />}
            </button>
          </nav>

          {/* Mobile toggle */}
          <div className="fm-mob-toggle" style={{ display: "none", alignItems: "center", gap: 4 }}>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }} aria-label="Toggle theme">
              {dark ? <Sun /> : <Moon />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ ...btnGhost, padding: 8 }} aria-label="Menu">
              {menuOpen ? <XIco /> : <MenuIco />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position: "fixed", inset: 0, top: 60, zIndex: 99,
            background: c.bg, padding: "24px", animation: "fadeIn 0.15s ease",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {navLinks.map(link => (
              <button key={link.key} onClick={() => setMenuOpen(false)} style={{
                ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%",
                justifyContent: "flex-start", gap: 12,
                color: link.key === "dashboard" ? c.red : c.textMuted,
                fontWeight: link.key === "dashboard" ? 700 : 500,
              }}>
                {link.icon} {link.label}
              </button>
            ))}
            <div style={{ height: 1, background: c.border, margin: "8px 0" }} />
            <button onClick={() => setMenuOpen(false)} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12 }}>
              <UserIco /> Profile
            </button>
            <button style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: c.red }}>
              <LogoutIco /> Log out
            </button>
          </div>
        )}
      </header>

      {/* ═══ DASHBOARD CONTENT ════════════════════════════════ */}
      <div style={{ ...maxW, padding: "36px 24px 80px" }}>

        {/* Welcome */}
        <div className="au" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Avatar name={user.name} size={52} />
          <div>
            <h1 style={{ ...serif, fontSize: 28, lineHeight: 1.15 }}>
              Welcome back, {user.name.split(" ")[0]}.
            </h1>
            <p style={{ color: c.textSoft, fontSize: 13, marginTop: 2, ...mono, letterSpacing: "0.02em" }}>
              Here's what's happening in the community
            </p>
          </div>
        </div>

        {/* Grid: Main + Sidebar */}
        <div className="fm-dash-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start",
        }}>

          {/* ─── MAIN COLUMN ──────────────────────────────── */}
          <div style={{ display: "grid", gap: 20 }}>

            {/* Pinned Announcement */}
            {announcements.filter(a => a.pinned).map(a => (
              <div key={a.id} className="au1" style={{
                ...cardStyle, borderColor: c.redBorder,
                borderLeft: `3px solid ${c.red}`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -20, right: -20,
                  width: 80, height: 80, borderRadius: "50%",
                  background: c.redSoft,
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ color: c.red }}><PinIco s={13} /></span>
                    <span style={{
                      ...mono, fontSize: 10, fontWeight: 600, color: c.red,
                      textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>Pinned</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{a.title}</h3>
                  <p style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.65 }}>{a.body}</p>
                  <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 12 }}>{a.date}</div>
                </div>
              </div>
            ))}

            {/* Upcoming Events */}
            <div className="au2">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: c.textSoft }}><CalIco /></span>
                  Upcoming events
                </h2>
                <button style={{ ...btnGhost, color: c.red, fontSize: 12, gap: 4 }}>
                  See all <ArrowR />
                </button>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {events.slice(0, 3).map(ev => (
                  <div key={ev.id} className="fm-hover-card" style={{
                    ...cardStyle, padding: "16px 20px",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", gap: 14, flexWrap: "wrap",
                    borderColor: ev.rsvpd ? c.mintBorder : c.border,
                  }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{
                          ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                          borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.04em",
                          background: ev.type === "Workshop" ? c.redSoft : ev.type === "Q&A" ? c.mintSoft : c.surface,
                          color: ev.type === "Workshop" ? c.red : ev.type === "Q&A" ? c.mint : c.textMuted,
                          border: `1px solid ${ev.type === "Workshop" ? c.redBorder : ev.type === "Q&A" ? c.mintBorder : c.border}`,
                        }}>{ev.type}</span>
                        {ev.rsvpd && (
                          <span style={{ fontSize: 11, color: c.mint, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                            <Check s={12} /> Going
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
                      <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 3 }}>{ev.date} · {ev.time}</div>
                    </div>
                    <button onClick={() => toggleRsvp(ev.id)} style={ev.rsvpd ? {
                      ...btnOutline, padding: "8px 14px", fontSize: 12,
                      borderColor: c.mintBorder, color: c.mint,
                    } : {
                      ...btnRed, padding: "8px 14px", fontSize: 12,
                    }}>
                      {ev.rsvpd ? "Cancel" : "RSVP"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="au3">
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: c.textSoft }}><MegaIco /></span>
                Announcements
              </h2>
              <div style={{ display: "grid", gap: 10 }}>
                {announcements.filter(a => !a.pinned).map(a => (
                  <div key={a.id} className="fm-hover-card" style={{ ...cardStyle, padding: "18px 20px" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{a.title}</h3>
                    <p style={{ color: c.textMuted, fontSize: 13, lineHeight: 1.6 }}>{a.body}</p>
                    <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 10 }}>{a.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Content */}
            <div className="au4">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: c.textSoft }}><BookIco /></span>
                  Recent in library
                </h2>
                <button style={{ ...btnGhost, color: c.red, fontSize: 12, gap: 4 }}>
                  Open library <ArrowR />
                </button>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {recentContent.map((item, i) => (
                  <div key={i} className="fm-hover-card" style={{
                    ...cardStyle, padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                  }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 6,
                      background: item.type === "Conference" ? c.redSoft : c.mintSoft,
                      border: `1px solid ${item.type === "Conference" ? c.redBorder : c.mintBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: item.type === "Conference" ? c.red : c.mint, flexShrink: 0,
                    }}>
                      {item.type === "Conference" ? <PlayIco /> : <BookIco s={14} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                      <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 2 }}>{item.speaker}</div>
                    </div>
                    <span style={{
                      ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                      borderRadius: 3, background: c.surface, color: c.textMuted,
                      border: `1px solid ${c.border}`,
                    }}>{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── SIDEBAR ──────────────────────────────────── */}
          <aside style={{ display: "grid", gap: 16 }}>

            {/* Quick Links */}
            <div className="au1" style={cardStyle}>
              <h3 style={{
                ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft,
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
              }}>Quick links</h3>
              <div style={{ display: "grid", gap: 2 }}>
                {[
                  { icon: <PlayIco />, label: "Conference videos", color: c.red },
                  { icon: <BookIco s={14} />, label: "Resources & frameworks", color: c.mint },
                  { icon: <UsersIco s={14} />, label: "Member directory", color: c.textMuted },
                  { icon: <UserIco s={14} />, label: "Edit your profile", color: c.textMuted },
                ].map((item, i) => (
                  <button key={i} className="fm-sidebar-btn" style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "10px 10px", borderRadius: 4,
                    background: "transparent", color: c.text, cursor: "pointer",
                    fontSize: 13, ...sans, textAlign: "left",
                  }}>
                    <span style={{ color: item.color, flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* New Members */}
            <div className="au2" style={cardStyle}>
              <h3 style={{
                ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft,
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
              }}>New members</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {newMembers.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={m.name} size={32} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      <div style={{ ...mono, fontSize: 10, color: c.textSoft }}>{m.discipline}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{
                ...btnGhost, width: "100%", justifyContent: "center",
                marginTop: 14, fontSize: 12, color: c.red, gap: 4,
                borderTop: `1px solid ${c.border}`, borderRadius: 0,
                paddingTop: 14,
              }}>
                View all members <ArrowR />
              </button>
            </div>

            {/* WhatsApp */}
            <div className="au3" style={{
              ...cardStyle,
              background: dark ? "rgba(37,211,102,0.06)" : "rgba(37,211,102,0.04)",
              borderColor: "rgba(37,211,102,0.2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#25D366",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "#fff", fontWeight: 700,
                }}>W</div>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>WhatsApp Community</h3>
              </div>
              <p style={{ fontSize: 12, color: c.textMuted, marginBottom: 14, lineHeight: 1.5 }}>
                Live conversations, session links, and updates happen here.
              </p>
              <button style={{
                ...btnBase, width: "100%", justifyContent: "center",
                background: "#25D366", color: "#fff", fontSize: 13, padding: "10px 16px",
              }}>
                Join WhatsApp
              </button>
            </div>

            {/* Your Stats */}
            <div className="au4" style={cardStyle}>
              <h3 style={{
                ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft,
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
              }}>Your activity</h3>
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  { label: "Events attended", value: "2" },
                  { label: "Resources viewed", value: "5" },
                  { label: "Member since", value: "Feb 2026" },
                ].map((stat, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: c.textMuted }}>{stat.label}</span>
                    <span style={{ ...mono, fontSize: 13, fontWeight: 600, color: c.text }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ FOOTER ═══════════════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${c.border}`, padding: "24px",
        background: c.surface, textAlign: "center",
      }}>
        <p style={{ ...mono, fontSize: 11, color: c.textSoft }}>
          Form & Meaning · Design is not decoration. It's a decision. · © 2026
        </p>
      </footer>
    </div>
  );
}
