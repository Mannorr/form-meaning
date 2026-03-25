"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — EVENTS PAGE
// Wired to real Supabase data via server component props
// ═══════════════════════════════════════════════════════════════

export default function EventsPage({ upcoming: serverUpcoming = [], past: serverPast = [] }) {
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("upcoming");
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [events, setEvents] = useState(serverUpcoming.map(e => ({ ...e, rsvpd: false })));
  const [pastEvents, setPastEvents] = useState(serverPast);
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  // Fetch fresh events + user RSVPs client-side
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/events").then(r => r.json()),
      fetch("/api/rsvp").then(r => r.json()).catch(() => ({ rsvps: [] }))
    ]).then(([evData, rsvpData]) => {
      const rsvpIds = rsvpData.rsvps || [];
      const today = new Date().toISOString().split("T")[0];
      if (evData.data) {
        const upcoming = evData.data.filter(e => e.status === "upcoming" || (e.date && e.date >= today && e.status !== "completed"));
        const past = evData.data.filter(e => e.status === "completed" || (e.date && e.date < today));
        setEvents(upcoming.map(e => ({ ...e, rsvpd: rsvpIds.includes(e.id) })));
        setPastEvents(past);
      }
    }).catch(() => {});
  }, []);

  const toggleRsvp = async (id) => {
    // Optimistic update
    setEvents(evs => evs.map(e => e.id === id ? { ...e, rsvpd: !e.rsvpd } : e));
    try {
      await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event_id: id }) });
    } catch (e) {
      // Revert on error
      setEvents(evs => evs.map(e => e.id === id ? { ...e, rsvpd: !e.rsvpd } : e));
    }
  };
  const toggleExpand = (id) => setExpandedEvent(expandedEvent === id ? null : id);

  // Format dates
  const fmtDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };
  const fmtShortDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // ─── Brand Tokens ──────────────────────────────────────────
  const c = dark ? {
    bg: "#111111", bg2: "#1A1A1A", bg3: "#222222",
    surface: "rgba(255,255,255,0.04)", surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    text: "#F5F0EB", textMuted: "rgba(245,240,235,0.6)", textSoft: "rgba(245,240,235,0.35)",
    red: "#E63228", redSoft: "rgba(230,50,40,0.12)", redBorder: "rgba(230,50,40,0.3)",
    mint: "#3EDEB5", mintSoft: "rgba(62,222,181,0.1)", mintBorder: "rgba(62,222,181,0.25)",
    amber: "#D4A843", amberSoft: "rgba(212,168,67,0.1)", amberBorder: "rgba(212,168,67,0.25)",
    navBg: "rgba(17,17,17,0.88)", cardBg: "#1A1A1A",
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    amber: "#B8922A", amberSoft: "rgba(184,146,42,0.08)", amberBorder: "rgba(184,146,42,0.2)",
    navBg: "rgba(245,240,235,0.9)", cardBg: "#FFFFFF",
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
  const Ico = ({ d, size = 20, sw = 2, fill = "none" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
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
    const safeName = name || "?";
    const colors = ["#E63228","#3EDEB5","#D4A843","#4A6FD9","#9B6FCF","#E07BAC","#5CB8B2"];
    const idx = safeName.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % colors.length;
    const initials = safeName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return <div style={{ width: size, height: size, borderRadius: "50%", background: colors[idx], display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, color: "#fff", flexShrink: 0, ...sans }}>{initials}</div>;
  };

  const navLinks = [
    { key: "dashboard", label: "Dashboard", icon: <HomeI />, href: "/dashboard" },
    { key: "library", label: "Library", icon: <BookI />, href: "/library" },
    { key: "community", label: "Community", icon: <UsersI />, href: "/community" },
    { key: "events", label: "Events", icon: <CalI />, href: "/events" },
  ];

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
  return (
    <div style={{ ...sans, background: c.bg, color: c.text, minHeight: "100vh", transition: "background 0.35s ease, color 0.35s ease", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${c.red}44; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .au { animation: fadeUp 0.5s ease both; }
        .au1 { animation: fadeUp 0.5s ease 0.06s both; }
        .au2 { animation: fadeUp 0.5s ease 0.12s both; }
        .fm-ev-hover { transition: border-color 0.15s ease; }
        .fm-ev-hover:hover { border-color: ${c.borderStrong} !important; }
        @media (max-width: 900px) { .fm-desk-nav { display: none !important; } .fm-mob-toggle { display: flex !important; } }
        @media (min-width: 901px) { .fm-mob-toggle { display: none !important; } }
        @media (max-width: 580px) { .fm-ev-meta-row { flex-direction: column; align-items: flex-start !important; gap: 8px !important; } .fm-ev-btn-row { flex-direction: column; } .fm-ev-btn-row > * { width: 100%; justify-content: center; } .fm-ev-details-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ═══ NAVBAR ═══════════════════════════════════════════ */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: c.navBg, backdropFilter: "blur(20px) saturate(180%)", borderBottom: `1px solid ${c.border}` }}>
        <div style={{ ...maxW, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <button onClick={() => window.location.href="/dashboard"} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", color: c.text, ...sans }}>
            <div style={{ width: 32, height: 32, borderRadius: 3, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff" }}>F</div>
            <div style={{ textAlign: "left" }}><div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Form & Meaning</div><div style={{ fontSize: 10, color: c.textSoft }}>Member area</div></div>
          </button>
          <nav className="fm-desk-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(link => (
              <button key={link.key} onClick={() => window.location.href=link.href} style={{ ...btnGhost, gap: 6, color: pathname === link.href ? c.red : c.textMuted, fontWeight: pathname === link.href ? 700 : 500 }}}>
                <span style={{ color: pathname === link.href ? c.red : c.textSoft }}>{link.icon}</span>{link.label}
              </button>
            ))}
            <span style={{ width: 1, height: 20, background: c.border, margin: "0 6px" }} />
            <button onClick={() => window.location.href="/profile"} style={{ ...btnGhost, padding: "4px 8px" }}><Avatar name="M" /></button>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }}>{dark ? <Sun /> : <Moon />}</button>
          </nav>
          <div className="fm-mob-toggle" style={{ display: "none", alignItems: "center", gap: 4 }}>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }}>{dark ? <Sun /> : <Moon />}</button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ ...btnGhost, padding: 8 }}>{menuOpen ? <XIco /> : <MenuIco />}</button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ position: "fixed", inset: 0, top: 60, zIndex: 99, background: c.bg, padding: 24, animation: "fadeIn 0.15s ease", display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map(link => (
              <button key={link.key} onClick={() => { setMenuOpen(false); window.location.href=link.href; }} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: pathname === link.href ? c.red : c.textMuted }}}>{link.icon} {link.label}</button>
            ))}
            <div style={{ height: 1, background: c.border, margin: "8px 0" }} />
            <button onClick={() => window.location.href="/profile"} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12 }}><UserI s={16} /> Profile</button>
            <button onClick={async () => { const { supabase } = await import("@/lib/supabase"); await supabase.auth.signOut(); window.location.href="/"; }} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: c.red }}><LogoutI /> Log out</button>
          </div>
        )}
      </header>

      {/* ═══ PAGE CONTENT ═════════════════════════════════════ */}
      <div style={{ ...maxW, padding: "36px 24px 80px" }}>
        <div className="au" style={{ marginBottom: 28 }}>
          <h1 style={{ ...serif, fontSize: 32, lineHeight: 1.1 }}>Events</h1>
          <p style={{ color: c.textMuted, fontSize: 14, marginTop: 4 }}>Where thinking happens out loud. Sessions, workshops, and Q&As.</p>
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
              fontWeight: tab === t.key ? 700 : 500, ...mono, gap: 6,
            }}>
              {t.label}
              <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 10, background: tab === t.key ? c.red : c.surface, color: tab === t.key ? "#fff" : c.textSoft, fontWeight: 700 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* ─── UPCOMING ───────────────────────────────────── */}
        {tab === "upcoming" && (
          <div className="au2" style={{ display: "grid", gap: 16 }}>
            {events.length > 0 ? events.map(ev => {
              const tc = typeColor(ev.type);
              const expanded = expandedEvent === ev.id;
              return (
                <div key={ev.id} className="fm-ev-hover" style={{ ...cardStyle, overflow: "hidden", borderColor: ev.rsvpd ? c.mintBorder : expanded ? c.redBorder : c.border }}>
                  {ev.rsvpd && <div style={{ height: 3, background: c.mint }} />}
                  <div style={{ padding: "22px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                          <span style={{ ...mono, fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 3, textTransform: "uppercase", background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{ev.type || "Event"}</span>
                          {ev.rsvpd && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: c.mint, fontWeight: 600 }}><CheckI s={13} /> You're going</span>}
                        </div>
                        <h2 style={{ ...serif, fontSize: 22, lineHeight: 1.2, marginBottom: 8 }}>{ev.title}</h2>
                        <div className="fm-ev-meta-row" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 5, ...mono, fontSize: 12, color: c.textSoft }}><CalI s={13} /> {fmtDate(ev.date)}</span>
                          {ev.time && <span style={{ display: "flex", alignItems: "center", gap: 5, ...mono, fontSize: 12, color: c.textSoft }}><ClockI s={13} /> {ev.time}</span>}
                        </div>
                      </div>
                      <div className="fm-ev-btn-row" style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                        <button onClick={() => toggleRsvp(ev.id)} style={ev.rsvpd ? { ...btnOutline, padding: "10px 20px", borderColor: c.mintBorder, color: c.mint } : { ...btnRed, padding: "10px 20px" }}>
                          {ev.rsvpd ? <><CheckI s={14} /> Going</> : "RSVP"}
                        </button>
                        <button onClick={() => toggleExpand(ev.id)} style={{ ...btnOutline, padding: "10px 14px" }}>
                          {expanded ? <ChevUp s={16} /> : <ChevDown s={16} />}
                        </button>
                      </div>
                    </div>

                    {expanded && (
                      <div style={{ marginTop: 16, paddingTop: 18, borderTop: `1px solid ${c.border}`, animation: "fadeIn 0.2s ease" }}>
                        {ev.description && <p style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.65, marginBottom: 18 }}>{ev.description}</p>}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="fm-ev-details-grid">
                          {ev.topics && ev.topics.length > 0 && (
                            <div>
                              <h4 style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>What we'll cover</h4>
                              <div style={{ display: "grid", gap: 8 }}>
                                {ev.topics.map((topic, ti) => (
                                  <div key={ti} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ color: c.mint }}><HashI /></span>
                                    <span style={{ fontSize: 13, color: c.textMuted }}>{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <h4 style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Details</h4>
                            <div style={{ display: "grid", gap: 10 }}>
                              {ev.host && (
                                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                  <span style={{ color: c.textSoft, marginTop: 1 }}><UserI s={13} /></span>
                                  <div><div style={{ fontSize: 13, fontWeight: 600 }}>{ev.host}</div></div>
                                </div>
                              )}
                              {ev.location && (
                                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                  <span style={{ color: c.textSoft, marginTop: 1 }}><MapI /></span>
                                  <div style={{ fontSize: 13, color: c.textMuted }}>{ev.location}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}>
                <p style={{ color: c.textMuted, fontSize: 14 }}>No upcoming events. Stay tuned.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PAST ───────────────────────────────────────── */}
        {tab === "past" && (
          <div className="au2" style={{ display: "grid", gap: 12 }}>
            {pastEvents.length > 0 ? pastEvents.map(ev => {
              const tc = typeColor(ev.type);
              return (
                <div key={ev.id} className="fm-ev-hover" style={{ ...cardStyle, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", opacity: 0.85 }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 3, textTransform: "uppercase", background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{ev.type || "Event"}</span>
                      <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{fmtShortDate(ev.date)}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{ev.title}</h3>
                    {ev.description && <p style={{ fontSize: 13, color: c.textSoft, lineHeight: 1.5 }}>{(ev.description).length > 100 ? (ev.description).slice(0, 100) + "…" : ev.description}</p>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <button onClick={() => window.location.href="/library"} style={{ ...btnOutline, padding: "8px 14px", fontSize: 12, gap: 5, borderColor: c.redBorder, color: c.red }}>
                      <PlayI s={12} /> Watch
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}>
                <p style={{ color: c.textMuted, fontSize: 14 }}>No past events yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Summary stats */}
        <div className="au2" style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap", padding: "22px 26px", borderRadius: 8, background: c.surface, border: `1px solid ${c.border}` }}>
          {[
            { value: events.length, label: "Upcoming" },
            { value: pastEvents.length, label: "Completed" },
            { value: events.filter(e => e.rsvpd).length, label: "Your RSVPs" },
          ].map((stat, i) => (
            <div key={i} style={{ minWidth: 100 }}>
              <div style={{ ...serif, fontSize: 24, fontWeight: 700, color: c.red }}>{stat.value}</div>
              <div style={{ ...mono, fontSize: 10, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${c.border}`, padding: 24, background: c.surface, textAlign: "center" }}>
        <p style={{ ...mono, fontSize: 11, color: c.textSoft }}>Form & Meaning · Design is not decoration. It's a decision. · © 2026</p>
      </footer>
    </div>
  );
}
