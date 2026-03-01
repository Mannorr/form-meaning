"use client";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — EVENTS PAGE (File 6 of N)
// Upcoming & past events with RSVP, details, and filtering
// ═══════════════════════════════════════════════════════════════

export default function EventsPage() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("upcoming"); // upcoming | past
  const [expandedEvent, setExpandedEvent] = useState(null);
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  const user = { name: "Mannorr" };

  const [events, setEvents] = useState([
    {
      id: 1, title: "Designing with Intention",
      date: "Mar 14, 2026", time: "6:00 PM WAT", day: "Saturday",
      type: "Workshop", spots: 12, spotsLeft: 5, rsvpd: false,
      host: "Mannorr", hostRole: "Visual & Brand Designer",
      desc: "A deep session on aligning every design decision with a clear purpose. We'll break down real projects and rebuild the thinking behind them. You'll leave with a framework you can apply to your next brief.",
      topics: ["Intentional design process", "Deconstructing briefs", "Decision-making frameworks"],
      location: "Google Meet (link shared after RSVP)",
    },
    {
      id: 2, title: "The Brief Behind the Brief",
      date: "Mar 21, 2026", time: "6:00 PM WAT", day: "Saturday",
      type: "Q&A", spots: null, spotsLeft: null, rsvpd: true,
      host: "Community", hostRole: "Open session",
      desc: "Clients say one thing, mean another. This session teaches you to decode briefs and find the real problem before you start solving the wrong one. Bring your own brief examples.",
      topics: ["Reading between the lines", "Asking the right questions", "Client communication"],
      location: "Google Meet (link shared after RSVP)",
    },
    {
      id: 3, title: "Portfolio as Proof",
      date: "Apr 4, 2026", time: "5:00 PM WAT", day: "Saturday",
      type: "Masterclass", spots: 8, spotsLeft: 3, rsvpd: false,
      host: "Dexios", hostRole: "Brand Strategist · Identity Designer",
      desc: "Your portfolio isn't a gallery — it's an argument. Learn to present work that shows how you think, not just what you made. We'll review real portfolios and rebuild the narrative.",
      topics: ["Portfolio storytelling", "Case study structure", "Showing process over output"],
      location: "Google Meet (link shared after RSVP)",
    },
    {
      id: 4, title: "Systems That Stick",
      date: "Apr 18, 2026", time: "6:00 PM WAT", day: "Saturday",
      type: "Workshop", spots: 10, spotsLeft: 10, rsvpd: false,
      host: "Mannorr", hostRole: "Visual & Brand Designer",
      desc: "How to build personal design systems and processes that make your best work repeatable. Beyond templates — this is about building thinking habits that scale.",
      topics: ["Personal design systems", "Process documentation", "Scaling quality"],
      location: "Google Meet (link shared after RSVP)",
    },
  ]);

  const pastEvents = [
    {
      id: 101, title: "Questions & Answers",
      date: "Feb 27, 2026", time: "6:00 PM WAT", day: "Thursday",
      type: "Q&A", host: "Community", hostRole: "Open session",
      desc: "Problem solving, responsibility, growth, pressure, leadership. Building work that lasts longer than a portfolio post.",
      attendees: 18, hasRecording: true,
    },
    {
      id: 102, title: "Form & Meaning Conference — Day 1",
      date: "Feb 19, 2026", time: "4:00 PM WAT", day: "Wednesday",
      type: "Conference", host: "Mannorr", hostRole: "Visual & Brand Designer",
      desc: "The Problem You Were Hired to Solve. The foundational talk that sets the direction for everything we do.",
      attendees: 30, hasRecording: true,
    },
    {
      id: 103, title: "Form & Meaning Conference — Day 2",
      date: "Feb 20, 2026", time: "4:00 PM WAT", day: "Thursday",
      type: "Conference", host: "Petra & Thizkid", hostRole: "Brand Identity · Visual Design",
      desc: "Creative Integrity in Practice. A candid conversation about designing with integrity when the client wants speed.",
      attendees: 28, hasRecording: true,
    },
    {
      id: 104, title: "Form & Meaning Conference — Day 3",
      date: "Feb 21, 2026", time: "4:00 PM WAT", day: "Friday",
      type: "Conference", host: "Dexios", hostRole: "Brand Strategist · Identity Designer",
      desc: "Systems That Scale Your Thinking. Building repeatable processes that make your best work your standard work.",
      attendees: 26, hasRecording: true,
    },
  ];

  const toggleRsvp = (id) => setEvents(evs => evs.map(e => e.id === id ? { ...e, rsvpd: !e.rsvpd, spotsLeft: e.rsvpd ? (e.spotsLeft !== null ? e.spotsLeft + 1 : null) : (e.spotsLeft !== null ? e.spotsLeft - 1 : null) } : e));
  const toggleExpand = (id) => setExpandedEvent(expandedEvent === id ? null : id);

  // ─── Brand Tokens ──────────────────────────────────────────
  const c = dark ? {
    bg: "#111111", bg2: "#1A1A1A", bg3: "#222222",
    surface: "rgba(255,255,255,0.04)", surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    text: "#F5F0EB", textMuted: "rgba(245,240,235,0.6)", textSoft: "rgba(245,240,235,0.35)",
    red: "#E63228", redSoft: "rgba(230,50,40,0.12)", redBorder: "rgba(230,50,40,0.3)",
    mint: "#3EDEB5", mintSoft: "rgba(62,222,181,0.1)", mintBorder: "rgba(62,222,181,0.25)",
    amber: "#D4A843", amberSoft: "rgba(212,168,67,0.1)", amberBorder: "rgba(212,168,67,0.25)",
    navBg: "rgba(17,17,17,0.88)", cardBg: "#1A1A1A", grain: 0.06,
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    amber: "#B8922A", amberSoft: "rgba(184,146,42,0.08)", amberBorder: "rgba(184,146,42,0.2)",
    navBg: "rgba(245,240,235,0.9)", cardBg: "#FFFFFF", grain: 0.04,
  };

  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const sans = { fontFamily: "'Syne', 'Helvetica Neue', sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const maxW = { maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" };

  const btnBase = { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s ease", ...sans };
  const btnRed = { ...btnBase, background: c.red, color: "#fff" };
  const btnOutline = { ...btnBase, background: "transparent", color: c.text, border: `1.5px solid ${c.borderStrong}` };
  const btnGhost = { ...btnBase, background: "transparent", color: c.textMuted, padding: "8px 12px" };
  const cardStyle = { background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 8, transition: "all 0.15s ease" };

  // ─── Icons ─────────────────────────────────────────────────
  const Ico = ({ d, size = 20, sw = 2, fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const Sun = () => <Ico d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />;
  const Moon = () => <Ico d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />;
  const MenuIco = () => <Ico size={22} d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
  const XIco = () => <Ico size={22} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
  const CheckI = ({ s = 14 }) => <Ico size={s} sw={2.5} d={<polyline points="20 6 9 17 4 12"/>} />;
  const CalI = ({ s = 16 }) => <Ico size={s} d={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />;
  const ClockI = ({ s = 14 }) => <Ico size={s} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />;
  const MapI = ({ s = 14 }) => <Ico size={s} d={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>} />;
  const UserI = ({ s = 14 }) => <Ico size={s} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />;
  const UsersI = ({ s = 16 }) => <Ico size={s} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />;
  const HomeI = ({ s = 16 }) => <Ico size={s} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />;
  const BookI = ({ s = 16 }) => <Ico size={s} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>} />;
  const PlayI = ({ s = 14 }) => <Ico size={s} fill="currentColor" sw={0} d={<polygon points="5 3 19 12 5 21 5 3"/>} />;
  const ChevDown = ({ s = 16 }) => <Ico size={s} d={<polyline points="6 9 12 15 18 9"/>} />;
  const ChevUp = ({ s = 16 }) => <Ico size={s} d={<polyline points="18 15 12 9 6 15"/>} />;
  const LogoutI = ({ s = 16 }) => <Ico size={s} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />;
  const HashI = ({ s = 13 }) => <Ico size={s} d={<><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></>} />;

  const Avatar = ({ name, size = 32 }) => {
    const colors = ["#E63228","#3EDEB5","#D4A843","#4A6FD9","#9B6FCF","#E07BAC","#5CB8B2"];
    const idx = name.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % colors.length;
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", background: colors[idx],
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 700, color: "#fff", flexShrink: 0, ...sans,
      }}>{initials}</div>
    );
  };

  const navLinks = [
    { key: "dashboard", label: "Dashboard", icon: <HomeI />, href: "/dashboard" },
    { key: "library", label: "Library", icon: <BookI />, href: "/library" },
    { key: "community", label: "Community", icon: <UsersI />, href: "/community" },
    { key: "events", label: "Events", icon: <CalI />, href: "/events" },
  ];

  // ─── Type badge colors ─────────────────────────────────────
  const typeColor = (type) => {
    switch (type) {
      case "Workshop": return { bg: c.redSoft, color: c.red, border: c.redBorder };
      case "Q&A": return { bg: c.mintSoft, color: c.mint, border: c.mintBorder };
      case "Masterclass": return { bg: c.amberSoft, color: c.amber, border: c.amberBorder };
      case "Conference": return { bg: c.redSoft, color: c.red, border: c.redBorder };
      default: return { bg: c.surface, color: c.textMuted, border: c.border };
    }
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
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
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
        .fm-ev-hover { transition: border-color 0.15s ease; }
        .fm-ev-hover:hover { border-color: ${c.borderStrong} !important; }
        @media (max-width: 900px) {
          .fm-desk-nav { display: none !important; }
          .fm-mob-toggle { display: flex !important; }
        }
        @media (min-width: 901px) { .fm-mob-toggle { display: none !important; } }
        @media (max-width: 580px) {
          .fm-ev-meta-row { flex-direction: column; align-items: flex-start !important; gap: 8px !important; }
          .fm-ev-btn-row { flex-direction: column; }
          .fm-ev-btn-row > * { width: 100%; justify-content: center; text-align: center; }
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
          <button style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", color: c.text, ...sans }} onClick={() => window.location.href="/dashboard"} aria-label="Home">
            <div style={{ width: 32, height: 32, borderRadius: 3, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff" }}>F</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Form & Meaning</div>
              <div style={{ fontSize: 10, color: c.textSoft, letterSpacing: "0.03em" }}>Member area</div>
            </div>
          </button>
          <nav className="fm-desk-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(link => (
              <button key={link.key} onClick={() => window.location.href=link.href} style={{
                ...btnGhost, gap: 6,
                color: link.key === "events" ? c.red : c.textMuted,
                fontWeight: link.key === "events" ? 700 : 500,
              }}>
                <span style={{ color: link.key === "events" ? c.red : c.textSoft }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
            <span style={{ width: 1, height: 20, background: c.border, margin: "0 6px" }} />
            <button onClick={() => window.location.href="/profile"} style={{ ...btnGhost, padding: "4px 8px" }}><Avatar name={user.name} /></button>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button>
          </nav>
          <div className="fm-mob-toggle" style={{ display: "none", alignItems: "center", gap: 4 }}>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }}>{dark ? <Sun /> : <Moon />}</button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ ...btnGhost, padding: 8 }}>{menuOpen ? <XIco /> : <MenuIco />}</button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ position: "fixed", inset: 0, top: 60, zIndex: 99, background: c.bg, padding: "24px", animation: "fadeIn 0.15s ease", display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map(link => (
              <button key={link.key} onClick={() => { setMenuOpen(false); window.location.href=link.href; }} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: link.key === "events" ? c.red : c.textMuted }}>{link.icon} {link.label}</button>
            ))}
            <div style={{ height: 1, background: c.border, margin: "8px 0" }} />
            <button style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12 }}><UserI s={16} /> Profile</button>
            <button style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: c.red }}><LogoutI /> Log out</button>
          </div>
        )}
      </header>

      {/* ═══ PAGE CONTENT ═════════════════════════════════════ */}
      <div style={{ ...maxW, padding: "36px 24px 80px" }}>

        {/* Header */}
        <div className="au" style={{ marginBottom: 28 }}>
          <h1 style={{ ...serif, fontSize: 32, lineHeight: 1.1 }}>Events</h1>
          <p style={{ color: c.textMuted, fontSize: 14, marginTop: 4 }}>
            Where thinking happens out loud. Sessions, workshops, and Q&As.
          </p>
        </div>

        {/* Tabs */}
        <div className="au1" style={{ display: "flex", gap: 4, marginBottom: 28, borderRadius: 4, border: `1px solid ${c.border}`, overflow: "hidden", width: "fit-content" }}>
          {[
            { key: "upcoming", label: "Upcoming", count: events.length },
            { key: "past", label: "Past", count: pastEvents.length },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setExpandedEvent(null); }} style={{
              ...btnGhost, borderRadius: 0, padding: "9px 18px", fontSize: 13, border: "none",
              background: tab === t.key ? c.redSoft : "transparent",
              color: tab === t.key ? c.red : c.textMuted,
              fontWeight: tab === t.key ? 700 : 500, ...mono, letterSpacing: "0.02em",
              gap: 6,
            }}>
              {t.label}
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 10,
                background: tab === t.key ? c.red : c.surface,
                color: tab === t.key ? "#fff" : c.textSoft,
                fontWeight: 700,
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* ─── UPCOMING EVENTS ────────────────────────────── */}
        {tab === "upcoming" && (
          <div className="au2" style={{ display: "grid", gap: 16 }}>
            {events.map((ev, i) => {
              const tc = typeColor(ev.type);
              const expanded = expandedEvent === ev.id;
              return (
                <div key={ev.id} className="fm-ev-hover" style={{
                  ...cardStyle, overflow: "hidden",
                  borderColor: ev.rsvpd ? c.mintBorder : expanded ? c.redBorder : c.border,
                }}>
                  {/* Top accent */}
                  {ev.rsvpd && <div style={{ height: 3, background: c.mint }} />}

                  <div style={{ padding: "22px 24px" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        {/* Tags */}
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                          <span style={{
                            ...mono, fontSize: 10, fontWeight: 600, padding: "3px 10px",
                            borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.04em",
                            background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                          }}>{ev.type}</span>
                          {ev.rsvpd && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: c.mint, fontWeight: 600 }}>
                              <CheckI s={13} /> You're going
                            </span>
                          )}
                          {ev.spotsLeft !== null && ev.spotsLeft <= 5 && !ev.rsvpd && (
                            <span style={{ ...mono, fontSize: 10, color: c.amber, fontWeight: 600 }}>
                              {ev.spotsLeft} spots left
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 style={{ ...serif, fontSize: 22, lineHeight: 1.2, marginBottom: 8 }}>{ev.title}</h2>

                        {/* Meta row */}
                        <div className="fm-ev-meta-row" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, ...mono, fontSize: 12, color: c.textSoft }}>
                            <CalI s={13} /> {ev.day}, {ev.date}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, ...mono, fontSize: 12, color: c.textSoft }}>
                            <ClockI s={13} /> {ev.time}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, ...mono, fontSize: 12, color: c.textSoft }}>
                            <UserI s={13} /> {ev.host}
                          </span>
                        </div>
                      </div>

                      {/* RSVP button */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                        <button onClick={() => toggleRsvp(ev.id)} style={ev.rsvpd ? {
                          ...btnOutline, borderColor: c.mintBorder, color: c.mint, fontSize: 13,
                        } : {
                          ...btnRed, fontSize: 13,
                        }}>
                          {ev.rsvpd ? "Cancel RSVP" : "RSVP"}
                        </button>
                        {ev.spots !== null && (
                          <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>
                            {ev.spotsLeft}/{ev.spots} spots
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description (always visible) */}
                    <p style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.65, marginTop: 14, maxWidth: 640 }}>
                      {ev.desc}
                    </p>

                    {/* Expand toggle */}
                    <button onClick={() => toggleExpand(ev.id)} style={{
                      ...btnGhost, fontSize: 12, color: c.red, marginTop: 12, padding: "6px 0", gap: 4,
                    }}>
                      {expanded ? <><ChevUp s={14} /> Less details</> : <><ChevDown s={14} /> More details</>}
                    </button>

                    {/* Expanded details */}
                    {expanded && (
                      <div style={{
                        marginTop: 16, paddingTop: 18, borderTop: `1px solid ${c.border}`,
                        animation: "fadeIn 0.2s ease",
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="fm-ev-details-grid">
                          {/* Topics */}
                          <div>
                            <h4 style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                              What we'll cover
                            </h4>
                            <div style={{ display: "grid", gap: 8 }}>
                              {ev.topics.map((topic, ti) => (
                                <div key={ti} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                  <span style={{ color: c.mint }}><HashI /></span>
                                  <span style={{ fontSize: 13, color: c.textMuted }}>{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Details */}
                          <div>
                            <h4 style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                              Details
                            </h4>
                            <div style={{ display: "grid", gap: 10 }}>
                              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ color: c.textSoft, marginTop: 1 }}><UserI s={13} /></span>
                                <div>
                                  <div style={{ fontSize: 13, fontWeight: 600 }}>{ev.host}</div>
                                  <div style={{ ...mono, fontSize: 11, color: c.textSoft }}>{ev.hostRole}</div>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ color: c.textSoft, marginTop: 1 }}><MapI /></span>
                                <div style={{ fontSize: 13, color: c.textMuted }}>{ev.location}</div>
                              </div>
                              {ev.spots && (
                                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                  <span style={{ color: c.textSoft, marginTop: 1 }}><UsersI s={14} /></span>
                                  <div style={{ fontSize: 13, color: c.textMuted }}>
                                    Limited to {ev.spots} members · {ev.spotsLeft} remaining
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <style>{`
                          @media (max-width: 580px) {
                            .fm-ev-details-grid { grid-template-columns: 1fr !important; }
                          }
                        `}</style>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── PAST EVENTS ────────────────────────────────── */}
        {tab === "past" && (
          <div className="au2" style={{ display: "grid", gap: 12 }}>
            {pastEvents.map(ev => {
              const tc = typeColor(ev.type);
              return (
                <div key={ev.id} className="fm-ev-hover" style={{
                  ...cardStyle, padding: "18px 22px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  gap: 16, flexWrap: "wrap", opacity: 0.85,
                }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                      <span style={{
                        ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                        borderRadius: 3, textTransform: "uppercase",
                        background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                      }}>{ev.type}</span>
                      <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{ev.date}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{ev.title}</h3>
                    <p style={{ fontSize: 13, color: c.textSoft, lineHeight: 1.5 }}>
                      {ev.desc.length > 100 ? ev.desc.slice(0, 100) + "…" : ev.desc}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ ...mono, fontSize: 11, color: c.textSoft, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                        <UsersI s={12} /> {ev.attendees} attended
                      </div>
                    </div>
                    {ev.hasRecording && (
                      <button style={{
                        ...btnOutline, padding: "8px 14px", fontSize: 12, gap: 5,
                        borderColor: c.redBorder, color: c.red,
                      }}>
                        <PlayI s={12} /> Watch
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary stats */}
        <div className="au2" style={{
          display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap",
          padding: "22px 26px", borderRadius: 8,
          background: c.surface, border: `1px solid ${c.border}`,
        }}>
          {[
            { value: events.length, label: "Upcoming" },
            { value: pastEvents.length, label: "Completed" },
            { value: events.filter(e => e.rsvpd).length, label: "Your RSVPs" },
            { value: pastEvents.reduce((sum, e) => sum + e.attendees, 0), label: "Total attendance" },
          ].map((stat, i) => (
            <div key={i} style={{ minWidth: 100 }}>
              <div style={{ ...serif, fontSize: 24, fontWeight: 700, color: c.red }}>{stat.value}</div>
              <div style={{ ...mono, fontSize: 10, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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
