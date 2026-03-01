"use client";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — LIBRARY PAGE (File 4 of N)
// Conference videos, resources, frameworks — the knowledge vault
// ═══════════════════════════════════════════════════════════════

export default function LibraryPage() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  const user = { name: "Mannorr" };

  // ─── Content Data ──────────────────────────────────────────
  const content = [
    {
      id: 1, type: "conference", title: "The Problem You Were Hired to Solve",
      speaker: "Mannorr", role: "Visual & Brand Designer",
      day: 1, tag: "Foundation", duration: "48 min",
      desc: "Before you design anything, understand the real problem. This talk strips away assumptions and rebuilds how you approach every brief.",
      required: true,
    },
    {
      id: 2, type: "conference", title: "Creative Integrity in Practice",
      speaker: "Petra & Thizkid", role: "Brand Identity · Visual Design",
      day: 2, tag: "Ethics", duration: "52 min",
      desc: "What does it mean to design with integrity? How do you hold standards when the client wants speed? A candid conversation about doing it right.",
      required: true,
    },
    {
      id: 3, type: "conference", title: "Systems That Scale Your Thinking",
      speaker: "Dexios", role: "Brand Strategist · Identity Designer",
      day: 3, tag: "Systems", duration: "44 min",
      desc: "Inspiration is unreliable. Systems aren't. Learn to build repeatable processes that make your best work your standard work.",
      required: true,
    },
    {
      id: 4, type: "resource", title: "Problem-Solving Framework",
      speaker: "Form & Meaning", role: "",
      tag: "Framework", format: "PDF",
      desc: "A structured set of questions to ask before you open any design tool. What's the real problem? Who's affected? What does success look like?",
      new: true,
    },
    {
      id: 5, type: "resource", title: "Systems Checklist",
      speaker: "Form & Meaning", role: "",
      tag: "Process", format: "PDF",
      desc: "How to document your process so your best work becomes your standard work. Not a template — a thinking habit.",
    },
    {
      id: 6, type: "resource", title: "Leadership Notes",
      speaker: "Form & Meaning", role: "",
      tag: "Growth", format: "Guide",
      desc: "What happens when a creative has to lead? How to hold standards without killing morale. How to move from executing to directing.",
    },
    {
      id: 7, type: "resource", title: "Brand Thinking Workbook",
      speaker: "Form & Meaning", role: "",
      tag: "Brand", format: "Workbook",
      desc: "A hands-on workbook for brand projects. Goes beyond mood boards into positioning, voice, strategy, and meaning.",
      new: true,
    },
    {
      id: 8, type: "recording", title: "Q&A Session — Feb 27",
      speaker: "Community", role: "Members session",
      tag: "Session", duration: "1h 12 min",
      desc: "Recorded Q&A covering problem solving, career pressure, leadership, and building work that lasts longer than a portfolio post.",
    },
  ];

  const filtered = content.filter(item => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.speaker.toLowerCase().includes(search.toLowerCase()) ||
      item.tag.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const conferenceItems = filtered.filter(i => i.type === "conference");
  const resourceItems = filtered.filter(i => i.type === "resource");
  const recordingItems = filtered.filter(i => i.type === "recording");

  // ─── Brand Tokens ──────────────────────────────────────────
  const c = dark ? {
    bg: "#111111", bg2: "#1A1A1A", bg3: "#222222",
    surface: "rgba(255,255,255,0.04)", surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    text: "#F5F0EB", textMuted: "rgba(245,240,235,0.6)", textSoft: "rgba(245,240,235,0.35)",
    red: "#E63228", redSoft: "rgba(230,50,40,0.12)", redBorder: "rgba(230,50,40,0.3)",
    mint: "#3EDEB5", mintSoft: "rgba(62,222,181,0.1)", mintBorder: "rgba(62,222,181,0.25)",
    amber: "#D4A843", amberSoft: "rgba(212,168,67,0.1)", amberBorder: "rgba(212,168,67,0.25)",
    navBg: "rgba(17,17,17,0.88)", cardBg: "#1A1A1A", inputBg: "#1A1A1A", grain: 0.06,
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    amber: "#B8922A", amberSoft: "rgba(184,146,42,0.08)", amberBorder: "rgba(184,146,42,0.2)",
    navBg: "rgba(245,240,235,0.9)", cardBg: "#FFFFFF", inputBg: "#FFFFFF", grain: 0.04,
  };

  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const sans = { fontFamily: "'Syne', 'Helvetica Neue', sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const maxW = { maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" };

  const btnBase = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "10px 18px", borderRadius: 4, fontSize: 13,
    fontWeight: 600, cursor: "pointer", border: "none",
    transition: "all 0.2s ease", ...sans,
  };
  const btnRed = { ...btnBase, background: c.red, color: "#fff" };
  const btnOutline = { ...btnBase, background: "transparent", color: c.text, border: `1.5px solid ${c.borderStrong}` };
  const btnGhost = { ...btnBase, background: "transparent", color: c.textMuted, padding: "8px 12px" };
  const cardStyle = {
    background: c.cardBg, border: `1px solid ${c.border}`,
    borderRadius: 8, transition: "all 0.15s ease",
  };
  const inputStyle = {
    width: "100%", padding: "11px 16px 11px 40px", borderRadius: 4,
    border: `1.5px solid ${c.borderStrong}`, background: c.inputBg,
    color: c.text, fontSize: 14, ...sans, outline: "none",
    transition: "border-color 0.15s ease",
  };

  // ─── Icons ─────────────────────────────────────────────────
  const Ico = ({ d, size = 20, sw = 2, fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const Sun = () => <Ico d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />;
  const Moon = () => <Ico d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />;
  const MenuIco = () => <Ico size={22} d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
  const XIco = () => <Ico size={22} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
  const SearchIco = ({ s = 16 }) => <Ico size={s} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />;
  const PlayIco = ({ s = 20 }) => <Ico size={s} fill="currentColor" sw={0} d={<polygon points="5 3 19 12 5 21 5 3"/>} />;
  const BookIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>} />;
  const DownloadIco = ({ s = 14 }) => <Ico size={s} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />;
  const ClockIco = ({ s = 13 }) => <Ico size={s} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />;
  const HomeIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />;
  const UsersIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />;
  const CalIco = ({ s = 16 }) => <Ico size={s} d={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />;
  const UserIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />;
  const StarIco = ({ s = 14 }) => <Ico size={s} d={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} />;
  const LogoutIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />;

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
    { key: "dashboard", label: "Dashboard", icon: <HomeIco />, href: "/dashboard" },
    { key: "library", label: "Library", icon: <BookIco />, href: "/library" },
    { key: "community", label: "Community", icon: <UsersIco />, href: "/community" },
    { key: "events", label: "Events", icon: <CalIco />, href: "/events" },
  ];

  const filters = [
    { key: "all", label: "All" },
    { key: "conference", label: "Conference" },
    { key: "resource", label: "Resources" },
    { key: "recording", label: "Recordings" },
  ];

  // ═══════════════════════════════════════════════════════════
  // VIDEO PLAYER MODAL
  // ═══════════════════════════════════════════════════════════
  const VideoModal = ({ video, onClose }) => (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeIn 0.2s ease",
    }} role="dialog" aria-modal="true" aria-label={video.title}>
      <div style={{
        width: "100%", maxWidth: 780, borderRadius: 10,
        background: c.cardBg, border: `1px solid ${c.borderStrong}`,
        overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
      }}>
        {/* Video area */}
        <div style={{
          width: "100%", aspectRatio: "16/9", background: "#000",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "transform 0.15s ease",
          }}>
            <PlayIco s={28} />
          </div>
          <div style={{
            position: "absolute", bottom: 14, left: 16,
            ...mono, fontSize: 11, color: "rgba(255,255,255,0.6)",
          }}>{video.duration}</div>
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.5)", border: "none",
            color: "#fff", cursor: "pointer", padding: 8, borderRadius: 4,
          }} aria-label="Close"><XIco /></button>
        </div>
        {/* Info */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {video.day && (
              <span style={{
                ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                borderRadius: 3, background: c.redSoft, color: c.red,
                border: `1px solid ${c.redBorder}`, textTransform: "uppercase",
              }}>Day {video.day}</span>
            )}
            <span style={{
              ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
              borderRadius: 3, background: c.surface, color: c.textMuted,
              border: `1px solid ${c.border}`, textTransform: "uppercase",
            }}>{video.tag}</span>
            {video.required && (
              <span style={{
                ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                borderRadius: 3, background: c.amberSoft, color: c.amber,
                border: `1px solid ${c.amberBorder}`, textTransform: "uppercase",
              }}>Required</span>
            )}
          </div>
          <h2 style={{ ...serif, fontSize: 22, lineHeight: 1.2, marginBottom: 4 }}>{video.title}</h2>
          <p style={{ ...mono, fontSize: 12, color: c.textSoft, marginBottom: 10 }}>
            {video.speaker}{video.role ? ` · ${video.role}` : ""}
          </p>
          <p style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.6 }}>{video.desc}</p>
        </div>
      </div>
    </div>
  );

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
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        }
        .au { animation: fadeUp 0.5s ease both; }
        .au1 { animation: fadeUp 0.5s ease 0.06s both; }
        .au2 { animation: fadeUp 0.5s ease 0.12s both; }
        .au3 { animation: fadeUp 0.5s ease 0.18s both; }
        .fm-card-hover { transition: border-color 0.15s ease, transform 0.15s ease; cursor: pointer; }
        .fm-card-hover:hover { border-color: ${c.borderStrong} !important; transform: translateY(-2px); }
        .fm-video-thumb { transition: transform 0.2s ease; }
        .fm-card-hover:hover .fm-video-thumb { transform: scale(1.03); }
        @media (max-width: 900px) {
          .fm-desk-nav { display: none !important; }
          .fm-mob-toggle { display: flex !important; }
        }
        @media (min-width: 901px) { .fm-mob-toggle { display: none !important; } }
        @media (max-width: 680px) {
          .fm-conf-grid { grid-template-columns: 1fr !important; }
          .fm-res-grid { grid-template-columns: 1fr !important; }
          .fm-filter-row { flex-wrap: wrap; }
        }
      `}</style>


      {/* ═══ NAVBAR ═══════════════════════════════════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: c.navBg, backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${c.border}`, transition: "all 0.35s ease",
      }}>
        <div style={{ ...maxW, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "none", cursor: "pointer", color: c.text, ...sans,
          }} onClick={() => window.location.href="/dashboard"} aria-label="Home">
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
          <nav className="fm-desk-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(link => (
              <button key={link.key} onClick={() => window.location.href=link.href} style={{
                ...btnGhost, gap: 6,
                color: link.key === "library" ? c.red : c.textMuted,
                fontWeight: link.key === "library" ? 700 : 500,
              }}>
                <span style={{ color: link.key === "library" ? c.red : c.textSoft }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
            <span style={{ width: 1, height: 20, background: c.border, margin: "0 6px" }} />
            <button onClick={() => window.location.href="/profile"} style={{ ...btnGhost, padding: "4px 8px" }}><Avatar name={user.name} /></button>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }} aria-label="Toggle theme">
              {dark ? <Sun /> : <Moon />}
            </button>
          </nav>
          <div className="fm-mob-toggle" style={{ display: "none", alignItems: "center", gap: 4 }}>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }}>{dark ? <Sun /> : <Moon />}</button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ ...btnGhost, padding: 8 }}>
              {menuOpen ? <XIco /> : <MenuIco />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{
            position: "fixed", inset: 0, top: 60, zIndex: 99,
            background: c.bg, padding: "24px", animation: "fadeIn 0.15s ease",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {navLinks.map(link => (
              <button key={link.key} onClick={() => { setMenuOpen(false); window.location.href=link.href; }} style={{
                ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%",
                justifyContent: "flex-start", gap: 12,
                color: link.key === "library" ? c.red : c.textMuted,
                fontWeight: link.key === "library" ? 700 : 500,
              }}>{link.icon} {link.label}</button>
            ))}
            <div style={{ height: 1, background: c.border, margin: "8px 0" }} />
            <button style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12 }}>
              <UserIco /> Profile
            </button>
            <button style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: c.red }}>
              <LogoutIco /> Log out
            </button>
          </div>
        )}
      </header>

      {/* ═══ PAGE CONTENT ═════════════════════════════════════ */}
      <div style={{ ...maxW, padding: "36px 24px 80px" }}>

        {/* Header + Search */}
        <div className="au" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ ...serif, fontSize: 32, lineHeight: 1.1 }}>Library</h1>
              <p style={{ color: c.textMuted, fontSize: 14, marginTop: 4 }}>
                Conference talks, frameworks, session recordings, and resources.
              </p>
            </div>
            <div style={{ ...mono, fontSize: 12, color: c.textSoft }}>
              {content.length} items
            </div>
          </div>

          {/* Search + Filters */}
          <div className="fm-filter-row" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: c.textSoft }}>
                <SearchIco />
              </span>
              <input
                type="text" placeholder="Search by title, speaker, or tag…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={inputStyle}
                aria-label="Search library"
              />
            </div>
            <div style={{ display: "flex", gap: 4, borderRadius: 4, border: `1px solid ${c.border}`, overflow: "hidden" }}>
              {filters.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  ...btnGhost, borderRadius: 0, padding: "8px 14px", fontSize: 12, border: "none",
                  background: filter === f.key ? c.redSoft : "transparent",
                  color: filter === f.key ? c.red : c.textMuted,
                  fontWeight: filter === f.key ? 700 : 500,
                  ...mono, letterSpacing: "0.02em",
                }}>{f.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── CONFERENCE SECTION ─────────────────────────── */}
        {(filter === "all" || filter === "conference") && conferenceItems.length > 0 && (
          <section className="au1" style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 4, background: c.red,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <PlayIco s={12} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Conference</h2>
              <span style={{
                ...mono, fontSize: 10, padding: "2px 8px", borderRadius: 3,
                background: c.amberSoft, color: c.amber, border: `1px solid ${c.amberBorder}`,
                fontWeight: 600, textTransform: "uppercase",
              }}>Required viewing</span>
            </div>

            <div className="fm-conf-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
            }}>
              {conferenceItems.map(item => (
                <div key={item.id} className="fm-card-hover" onClick={() => setActiveVideo(item)} style={{
                  ...cardStyle, overflow: "hidden",
                }}>
                  {/* Thumbnail */}
                  <div style={{ overflow: "hidden" }}>
                    <div className="fm-video-thumb" style={{
                      width: "100%", aspectRatio: "16/9",
                      background: `linear-gradient(135deg, ${c.red}18, ${c.bg3})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative",
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: "50%",
                        background: "rgba(230,50,40,0.9)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 20px rgba(230,50,40,0.3)",
                      }}>
                        <span style={{ color: "#fff" }}><PlayIco s={20} /></span>
                      </div>
                      {/* Day badge */}
                      <div style={{
                        position: "absolute", top: 10, left: 10,
                        ...mono, fontSize: 10, fontWeight: 700, padding: "4px 8px",
                        borderRadius: 3, background: "rgba(0,0,0,0.6)",
                        color: "#fff", backdropFilter: "blur(4px)",
                      }}>DAY {item.day}</div>
                      {/* Duration */}
                      <div style={{
                        position: "absolute", bottom: 10, right: 10,
                        ...mono, fontSize: 10, padding: "3px 7px",
                        borderRadius: 3, background: "rgba(0,0,0,0.6)",
                        color: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)",
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <ClockIco s={10} /> {item.duration}
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding: "16px 18px 18px" }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <span style={{
                        ...mono, fontSize: 10, fontWeight: 600, padding: "2px 8px",
                        borderRadius: 3, background: c.surface, color: c.textMuted,
                        border: `1px solid ${c.border}`,
                      }}>{item.tag}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ ...mono, fontSize: 11, color: c.textSoft }}>{item.speaker}</p>
                    <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.55, marginTop: 8 }}>
                      {item.desc.length > 100 ? item.desc.slice(0, 100) + "…" : item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── RECORDINGS SECTION ─────────────────────────── */}
        {(filter === "all" || filter === "recording") && recordingItems.length > 0 && (
          <section className="au2" style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 4, background: c.mintSoft,
                border: `1px solid ${c.mintBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: c.mint,
              }}>
                <PlayIco s={12} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Session Recordings</h2>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {recordingItems.map(item => (
                <div key={item.id} className="fm-card-hover" onClick={() => setActiveVideo(item)} style={{
                  ...cardStyle, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 16,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 6,
                    background: c.mintSoft, border: `1px solid ${c.mintBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: c.mint, flexShrink: 0,
                  }}>
                    <PlayIco s={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.5 }}>{item.desc.slice(0, 90)}…</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <span style={{ ...mono, fontSize: 11, color: c.textSoft, display: "flex", alignItems: "center", gap: 4 }}>
                      <ClockIco /> {item.duration}
                    </span>
                    <span style={{
                      ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                      borderRadius: 3, background: c.surface, color: c.textMuted,
                      border: `1px solid ${c.border}`,
                    }}>{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── RESOURCES SECTION ──────────────────────────── */}
        {(filter === "all" || filter === "resource") && resourceItems.length > 0 && (
          <section className="au3" style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 4, background: c.surface,
                border: `1px solid ${c.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: c.textMuted,
              }}>
                <BookIco s={13} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Resources & Frameworks</h2>
            </div>

            <div className="fm-res-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14,
            }}>
              {resourceItems.map(item => (
                <div key={item.id} className="fm-card-hover" style={{
                  ...cardStyle, padding: "22px 24px",
                  borderLeft: `3px solid ${item.new ? c.mint : c.border}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span style={{
                        ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                        borderRadius: 3, background: c.surface, color: c.textMuted,
                        border: `1px solid ${c.border}`, textTransform: "uppercase",
                      }}>{item.tag}</span>
                      <span style={{
                        ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                        borderRadius: 3, background: c.surface, color: c.textSoft,
                        border: `1px solid ${c.border}`,
                      }}>{item.format}</span>
                      {item.new && (
                        <span style={{
                          ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
                          borderRadius: 3, background: c.mintSoft, color: c.mint,
                          border: `1px solid ${c.mintBorder}`, textTransform: "uppercase",
                        }}>New</span>
                      )}
                    </div>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ color: c.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{item.desc}</p>
                  <button style={{
                    ...btnOutline, padding: "8px 14px", fontSize: 12, gap: 6,
                  }}>
                    <DownloadIco /> Download {item.format}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: c.textSoft,
          }}>
            <SearchIco s={32} />
            <p style={{ ...serif, fontSize: 20, marginTop: 16, color: c.text }}>No results found</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Try a different search or filter.</p>
            <button onClick={() => { setSearch(""); setFilter("all"); }} style={{ ...btnOutline, marginTop: 16, fontSize: 13 }}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}

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
