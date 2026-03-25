"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — MEMBER DASHBOARD
// Fetches announcements client-side for guaranteed fresh data
// ═══════════════════════════════════════════════════════════════

export default function DashboardPage({ user = {}, announcements: serverAnnouncements = [], events: serverEvents = [], content: serverContent = [], newMembers = [] }) {
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState(serverEvents.map(e => ({ ...e, rsvpd: false })));
  const [announcements, setAnnouncements] = useState(serverAnnouncements);
  const [content, setContent] = useState(serverContent);
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  // Client-side refresh using member-scoped routes (not admin routes)
  useEffect(() => {
    fetch("/api/member/announcements").then(r => r.json()).then(d => {
      if (d.data) setAnnouncements(d.data);
    }).catch(() => {});
    fetch("/api/member/content").then(r => r.json()).then(d => {
      if (d.data) setContent(d.data);
    }).catch(() => {});
    // Fetch this member's RSVPs and mark events accordingly
    fetch("/api/rsvp").then(r => r.json()).then(d => {
      if (d.rsvps) setEvents(evs => evs.map(e => ({ ...e, rsvpd: d.rsvps.includes(e.id) })));
    }).catch(() => {});
  }, []);

  // Derive display name
  const displayName = user.name || user.email?.split("@")[0] || "Member";
  const firstName = displayName.split(" ")[0];

  // RSVP toggle — calls real API
  const toggleRsvp = async (id) => {
    setEvents(evs => evs.map(e => e.id === id ? { ...e, rsvpd: !e.rsvpd } : e));
    try {
      await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event_id: id }) });
    } catch (e) {
      setEvents(evs => evs.map(e => e.id === id ? { ...e, rsvpd: !e.rsvpd } : e));
    }
  };

  // Format dates
  const fmtDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const fmtFullDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Member since
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  // ─── Brand Tokens ──────────────────────────────────────────
  const c = dark ? {
    bg: "#111111", bg2: "#1A1A1A", bg3: "#222222",
    surface: "rgba(255,255,255,0.04)", surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    text: "#F5F0EB", textMuted: "rgba(245,240,235,0.6)", textSoft: "rgba(245,240,235,0.35)",
    red: "#E63228", redSoft: "rgba(230,50,40,0.12)", redBorder: "rgba(230,50,40,0.3)",
    mint: "#3EDEB5", mintSoft: "rgba(62,222,181,0.1)", mintBorder: "rgba(62,222,181,0.25)",
    navBg: "rgba(17,17,17,0.88)", cardBg: "#1A1A1A",
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    navBg: "rgba(245,240,235,0.9)", cardBg: "#FFFFFF",
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
  const cardStyle = { background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 8, padding: 22, transition: "all 0.15s ease" };

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
    const safeName = name || "?";
    const colors = ["#E63228","#3EDEB5","#D4A843","#4A6FD9","#9B6FCF","#E07BAC","#5CB8B2","#D46B5D"];
    const idx = safeName.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % colors.length;
    const initials = safeName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", background: colors[idx],
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 700, color: "#fff", flexShrink: 0, ...sans,
      }}>{initials}</div>
    );
  };

  const navLinks = [
    { key: "dashboard", label: "Dashboard", icon: <HomeIco />, href: "/dashboard" },
    { key: "library", label: "Library", icon: <BookIco />, href: "/library" },
    { key: "community", label: "Community", icon: <UsersIco />, href: "/community" },
    { key: "events", label: "Events", icon: <CalIco />, href: "/events" },
  ];

  const pinnedAnnouncements = announcements.filter(a => a.pinned);
  const regularAnnouncements = announcements.filter(a => !a.pinned);

  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{ ...sans, background: c.bg, color: c.text, minHeight: "100vh", transition: "background 0.35s ease, color 0.35s ease", WebkitFontSmoothing: "antialiased", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${c.red}44; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .au { animation: fadeUp 0.5s ease both; }
        .au1 { animation: fadeUp 0.5s ease 0.06s both; }
        .au2 { animation: fadeUp 0.5s ease 0.12s both; }
        .au3 { animation: fadeUp 0.5s ease 0.18s both; }
        .au4 { animation: fadeUp 0.5s ease 0.24s both; }
        .fm-hover-card { transition: border-color 0.15s ease, transform 0.15s ease; }
        .fm-hover-card:hover { border-color: ${c.borderStrong} !important; transform: translateY(-1px); }
        .fm-sidebar-btn { transition: background 0.12s ease; border: none; }
        .fm-sidebar-btn:hover { background: ${c.surfaceHover} !important; }
        @media (max-width: 900px) { .fm-dash-grid { grid-template-columns: 1fr !important; } .fm-desk-nav { display: none !important; } .fm-mob-toggle { display: flex !important; } }
        @media (min-width: 901px) { .fm-mob-toggle { display: none !important; } }
      `}</style>

      {/* ═══ NAVBAR ═══════════════════════════════════════════ */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: c.navBg, backdropFilter: "blur(20px) saturate(180%)", borderBottom: `1px solid ${c.border}` }}>
        <div style={{ ...maxW, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <button onClick={() => window.location.href="/dashboard"} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", color: c.text, ...sans }} aria-label="Home">
            <div style={{ width: 32, height: 32, borderRadius: 3, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff" }}>F</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Form & Meaning</div>
              <div style={{ fontSize: 10, color: c.textSoft, letterSpacing: "0.03em" }}>Member area</div>
            </div>
          </button>
          <nav className="fm-desk-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(link => (
              <button key={link.key} onClick={() => window.location.href=link.href} style={{ ...btnGhost, color: pathname === link.href ? c.red : c.textMuted, fontWeight: pathname === link.href ? 700 : 500, gap: 6 }}>
                <span style={{ color: pathname === link.href ? c.red : c.textSoft }}>{link.icon}</span>{link.label}
              </button>
            ))}
            <span style={{ width: 1, height: 20, background: c.border, margin: "0 6px" }} />
            <button onClick={() => window.location.href="/profile"} style={{ ...btnGhost, padding: "4px 8px" }}><Avatar name={displayName} size={32} /></button>
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
              <button key={link.key} onClick={() => { setMenuOpen(false); window.location.href=link.href; }} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: pathname === link.href ? c.red : c.textMuted, fontWeight: pathname === link.href ? 700 : 500 }}}>{link.icon} {link.label}</button>
            ))}
            <div style={{ height: 1, background: c.border, margin: "8px 0" }} />
            <button onClick={() => window.location.href="/profile"} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12 }}><UserIco /> Profile</button>
            <button onClick={async () => { const { supabase } = await import("@/lib/supabase"); await supabase.auth.signOut(); window.location.href="/"; }} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: c.red }}><LogoutIco /> Log out</button>
          </div>
        )}
      </header>

      {/* ═══ CONTENT ══════════════════════════════════════════ */}
      <div style={{ ...maxW, padding: "36px 24px 80px" }}>

        {/* Welcome */}
        <div className="au" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Avatar name={displayName} size={52} />
          <div>
            <h1 style={{ ...serif, fontSize: 28, lineHeight: 1.15 }}>Welcome back, {firstName}.</h1>
            <p style={{ color: c.textSoft, fontSize: 13, marginTop: 2, ...mono }}>Here's what's happening in the community</p>
          </div>
        </div>

        <div className="fm-dash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* ─── MAIN ─────────────────────────────────────── */}
          <div style={{ display: "grid", gap: 20 }}>

            {/* Pinned */}
            {pinnedAnnouncements.map(a => (
              <div key={a.id} className="au1" style={{ ...cardStyle, borderColor: c.redBorder, borderLeft: `3px solid ${c.red}`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: c.redSoft }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ color: c.red }}><PinIco s={13} /></span>
                    <span style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.red, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pinned</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{a.title}</h3>
                  <p style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.65 }}>{a.body}</p>
                  <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 12 }}>{fmtFullDate(a.created_at)}</div>
                </div>
              </div>
            ))}

            {announcements.length === 0 && (
              <div className="au1" style={{ ...cardStyle, textAlign: "center", padding: 40 }}>
                <p style={{ color: c.textMuted, fontSize: 14 }}>No announcements yet. Check back soon.</p>
              </div>
            )}

            {/* Events */}
            <div className="au2">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: c.textSoft }}><CalIco /></span>Upcoming events</h2>
                <button onClick={() => window.location.href="/events"} style={{ ...btnGhost, color: c.red, fontSize: 12, gap: 4 }}>See all <ArrowR /></button>
              </div>
              {events.length > 0 ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {events.slice(0, 3).map(ev => (
                    <div key={ev.id} className="fm-hover-card" style={{ ...cardStyle, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", borderColor: ev.rsvpd ? c.mintBorder : c.border }}>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 3, textTransform: "uppercase", background: ev.type === "Workshop" ? c.redSoft : ev.type === "Q&A" ? c.mintSoft : c.surface, color: ev.type === "Workshop" ? c.red : ev.type === "Q&A" ? c.mint : c.textMuted, border: `1px solid ${ev.type === "Workshop" ? c.redBorder : ev.type === "Q&A" ? c.mintBorder : c.border}` }}>{ev.type || "Event"}</span>
                          {ev.rsvpd && <span style={{ fontSize: 11, color: c.mint, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}><Check s={12} /> Going</span>}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
                        <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 3 }}>{fmtDate(ev.date)}{ev.time ? ` · ${ev.time}` : ""}</div>
                      </div>
                      <button onClick={() => toggleRsvp(ev.id)} style={ev.rsvpd ? { ...btnOutline, padding: "8px 14px", fontSize: 12, borderColor: c.mintBorder, color: c.mint } : { ...btnRed, padding: "8px 14px", fontSize: 12 }}>{ev.rsvpd ? "Cancel" : "RSVP"}</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ ...cardStyle, textAlign: "center", padding: 30 }}><p style={{ color: c.textMuted, fontSize: 14 }}>No upcoming events. Stay tuned.</p></div>
              )}
            </div>

            {/* Regular Announcements */}
            {regularAnnouncements.length > 0 && (
              <div className="au3">
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: c.textSoft }}><MegaIco /></span>Announcements</h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {regularAnnouncements.map(a => (
                    <div key={a.id} className="fm-hover-card" style={{ ...cardStyle, padding: "18px 20px" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{a.title}</h3>
                      <p style={{ color: c.textMuted, fontSize: 13, lineHeight: 1.6 }}>{a.body}</p>
                      <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 10 }}>{fmtFullDate(a.created_at)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Content */}
            {content.length > 0 && (
              <div className="au4">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: c.textSoft }}><BookIco /></span>Recent in library</h2>
                  <button onClick={() => window.location.href="/library"} style={{ ...btnGhost, color: c.red, fontSize: 12, gap: 4 }}>Open library <ArrowR /></button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {content.slice(0, 3).map((item, i) => (
                    <div key={item.id || i} onClick={() => window.location.href="/library"} className="fm-hover-card" style={{ ...cardStyle, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 6, background: item.type === "conference" || item.type === "recording" ? c.redSoft : c.mintSoft, border: `1px solid ${item.type === "conference" || item.type === "recording" ? c.redBorder : c.mintBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: item.type === "conference" || item.type === "recording" ? c.red : c.mint, flexShrink: 0 }}>
                        {item.type === "conference" || item.type === "recording" ? <PlayIco /> : <BookIco s={14} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                        <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 2 }}>{item.speaker || "Form & Meaning"}</div>
                      </div>
                      <span style={{ ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 3, background: c.surface, color: c.textMuted, border: `1px solid ${c.border}`, textTransform: "capitalize" }}>{item.type === "conference" && item.day ? `Day ${item.day}` : item.format || item.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── SIDEBAR ──────────────────────────────────── */}
          <aside style={{ display: "grid", gap: 16 }}>
            <div className="au1" style={cardStyle}>
              <h3 style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Quick links</h3>
              <div style={{ display: "grid", gap: 2 }}>
                {[
                  { icon: <PlayIco />, label: "Conference videos", color: c.red, href: "/library" },
                  { icon: <BookIco s={14} />, label: "Resources & frameworks", color: c.mint, href: "/library" },
                  { icon: <UsersIco s={14} />, label: "Member directory", color: c.textMuted, href: "/community" },
                  { icon: <UserIco s={14} />, label: "Edit your profile", color: c.textMuted, href: "/profile" },
                ].map((item, i) => (
                  <button key={i} onClick={() => window.location.href=item.href} className="fm-sidebar-btn" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 10px", borderRadius: 4, background: "transparent", color: c.text, cursor: "pointer", fontSize: 13, ...sans, textAlign: "left" }}>
                    <span style={{ color: item.color, flexShrink: 0 }}>{item.icon}</span>{item.label}
                  </button>
                ))}
              </div>
            </div>

            {newMembers.length > 0 && (
              <div className="au2" style={cardStyle}>
                <h3 style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>New members</h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {newMembers.map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={m.name || m.email?.split("@")[0] || "Member"} size={32} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name || m.email?.split("@")[0] || "Member"}</div>
                        <div style={{ ...mono, fontSize: 10, color: c.textSoft }}>{m.discipline || m.email || "Creative"}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => window.location.href="/community"} style={{ ...btnGhost, width: "100%", justifyContent: "center", marginTop: 14, fontSize: 12, color: c.red, gap: 4, borderTop: `1px solid ${c.border}`, borderRadius: 0, paddingTop: 14 }}>View all members <ArrowR /></button>
              </div>
            )}

            <div className="au3" style={{ ...cardStyle, background: dark ? "rgba(37,211,102,0.06)" : "rgba(37,211,102,0.04)", borderColor: "rgba(37,211,102,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>W</div>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>WhatsApp Community</h3>
              </div>
              <p style={{ fontSize: 12, color: c.textMuted, marginBottom: 14, lineHeight: 1.5 }}>Live conversations, session links, and updates happen here.</p>
              <button onClick={() => window.open("https://chat.whatsapp.com/LQJAooUl2I6Godqz2s2CN6", "_blank")} style={{ ...btnBase, width: "100%", justifyContent: "center", background: "#25D366", color: "#fff", fontSize: 13, padding: "10px 16px" }}>Join WhatsApp</button>
            </div>

            <div className="au4" style={cardStyle}>
              <h3 style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Your activity</h3>
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  { label: "Events upcoming", value: String(events.length) },
                  { label: "Library items", value: String(content.length) },
                  { label: "Member since", value: memberSince },
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

      <footer style={{ borderTop: `1px solid ${c.border}`, padding: 24, background: c.surface, textAlign: "center" }}>
        <p style={{ ...mono, fontSize: 11, color: c.textSoft }}>Form & Meaning · Design is not decoration. It's a decision. · © 2026</p>
      </footer>
    </div>
  );
}
