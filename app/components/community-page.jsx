"use client";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — COMMUNITY DIRECTORY
// Wired to real Supabase data via server component props
// ═══════════════════════════════════════════════════════════════

export default function CommunityPage({ members: serverMembers = [] }) {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("All");
  const [expandedMember, setExpandedMember] = useState(null);
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  // Use real data
  const [members, setMembers] = useState(serverMembers);

  useEffect(() => {
    fetch("/api/admin/members").then(r => r.json()).then(d => {
      if (d.data) setMembers(d.data.filter(m => m.status === "active"));
    }).catch(() => {});
  }, []);
  const disciplines = ["All", ...new Set(members.map(m => m.discipline).filter(Boolean))].sort();

  const filtered = members.filter(m => {
    const matchSearch = !search.trim() ||
      (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.discipline || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.bio || "").toLowerCase().includes(search.toLowerCase());
    const matchDiscipline = disciplineFilter === "All" || m.discipline === disciplineFilter;
    return matchSearch && matchDiscipline;
  });

  // Format date
  const fmtJoined = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // ─── Brand Tokens ──────────────────────────────────────────
  const c = dark ? {
    bg: "#111111", bg2: "#1A1A1A", bg3: "#222222",
    surface: "rgba(255,255,255,0.04)", surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    text: "#F5F0EB", textMuted: "rgba(245,240,235,0.6)", textSoft: "rgba(245,240,235,0.35)",
    red: "#E63228", redSoft: "rgba(230,50,40,0.12)", redBorder: "rgba(230,50,40,0.3)",
    mint: "#3EDEB5", mintSoft: "rgba(62,222,181,0.1)", mintBorder: "rgba(62,222,181,0.25)",
    navBg: "rgba(17,17,17,0.88)", cardBg: "#1A1A1A", inputBg: "#1A1A1A",
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    navBg: "rgba(245,240,235,0.9)", cardBg: "#FFFFFF", inputBg: "#FFFFFF",
  };

  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const sans = { fontFamily: "'Syne', 'Helvetica Neue', sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const maxW = { maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" };
  const btnBase = { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s ease", ...sans };
  const btnOutline = { ...btnBase, background: "transparent", color: c.text, border: `1.5px solid ${c.borderStrong}` };
  const btnGhost = { ...btnBase, background: "transparent", color: c.textMuted, padding: "8px 12px" };
  const cardStyle = { background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 8, transition: "all 0.15s ease" };
  const inputStyle = { width: "100%", padding: "11px 16px 11px 40px", borderRadius: 4, border: `1.5px solid ${c.borderStrong}`, background: c.inputBg, color: c.text, fontSize: 14, ...sans, outline: "none" };

  // ─── Icons ─────────────────────────────────────────────────
  const Ico = ({ d, size = 20, sw = 2, fill = "none" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
  const Sun = () => <Ico d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />;
  const Moon = () => <Ico d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />;
  const MenuIco = () => <Ico size={22} d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
  const XIco = () => <Ico size={22} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
  const SearchIco = ({ s = 16 }) => <Ico size={s} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />;
  const HomeIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />;
  const BookIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>} />;
  const UsersIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />;
  const CalIco = ({ s = 16 }) => <Ico size={s} d={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />;
  const UserIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />;
  const LogoutIco = ({ s = 16 }) => <Ico size={s} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />;
  const ExtIco = ({ s = 12 }) => <Ico size={s} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>} />;
  const ChevIco = ({ s = 14 }) => <Ico size={s} d={<polyline points="6 9 12 15 18 9"/>} />;

  const Avatar = ({ name, size = 44 }) => {
    const safeName = name || "?";
    const colors = ["#E63228","#3EDEB5","#D4A843","#4A6FD9","#9B6FCF","#E07BAC","#5CB8B2","#D46B5D"];
    const idx = safeName.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % colors.length;
    const initials = safeName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return <div style={{ width: size, height: size, borderRadius: "50%", background: colors[idx], display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, color: "#fff", flexShrink: 0, ...sans }}>{initials}</div>;
  };

  const navLinks = [
    { key: "dashboard", label: "Dashboard", icon: <HomeIco />, href: "/dashboard" },
    { key: "library", label: "Library", icon: <BookIco />, href: "/library" },
    { key: "community", label: "Community", icon: <UsersIco />, href: "/community" },
    { key: "events", label: "Events", icon: <CalIco />, href: "/events" },
  ];

  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{ ...sans, background: c.bg, color: c.text, minHeight: "100vh", transition: "background 0.35s ease, color 0.35s ease", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${c.red}44; }
        input:focus-visible, select:focus-visible { outline: none; border-color: ${c.red} !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .au { animation: fadeUp 0.5s ease both; }
        .au1 { animation: fadeUp 0.5s ease 0.06s both; }
        .fm-member-card { transition: border-color 0.15s ease, transform 0.15s ease; }
        .fm-member-card:hover { border-color: ${c.borderStrong} !important; transform: translateY(-1px); }
        @media (max-width: 900px) { .fm-desk-nav { display: none !important; } .fm-mob-toggle { display: flex !important; } }
        @media (min-width: 901px) { .fm-mob-toggle { display: none !important; } }
        @media (max-width: 680px) { .fm-member-grid { grid-template-columns: 1fr !important; } .fm-filter-row { flex-direction: column; } }
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
              <button key={link.key} onClick={() => window.location.href=link.href} style={{ ...btnGhost, color: link.key === "community" ? c.red : c.textMuted, fontWeight: link.key === "community" ? 700 : 500, gap: 6 }}>
                <span style={{ color: link.key === "community" ? c.red : c.textSoft }}>{link.icon}</span>{link.label}
              </button>
            ))}
            <span style={{ width: 1, height: 20, background: c.border, margin: "0 6px" }} />
            <button onClick={() => window.location.href="/profile"} style={{ ...btnGhost, padding: "4px 8px" }}><Avatar name="M" size={32} /></button>
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
              <button key={link.key} onClick={() => { setMenuOpen(false); window.location.href=link.href; }} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: link.key === "community" ? c.red : c.textMuted, fontWeight: link.key === "community" ? 700 : 500 }}>{link.icon} {link.label}</button>
            ))}
            <div style={{ height: 1, background: c.border, margin: "8px 0" }} />
            <button onClick={() => window.location.href="/profile"} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12 }}><UserIco /> Profile</button>
            <button onClick={async () => { const { supabase } = await import("@/lib/supabase"); await supabase.auth.signOut(); window.location.href="/"; }} style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: c.red }}><LogoutIco /> Log out</button>
          </div>
        )}
      </header>

      {/* ═══ DIRECTORY ═════════════════════════════════════════ */}
      <div style={{ ...maxW, padding: "36px 24px 80px" }}>
        <div className="au" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ ...serif, fontSize: 32, lineHeight: 1.1 }}>Community</h1>
              <p style={{ color: c.textMuted, fontSize: 14, marginTop: 4 }}>Creatives who build with integrity. {members.length} members.</p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="fm-filter-row" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: c.textSoft }}><SearchIco /></span>
              <input type="text" placeholder="Search by name, discipline, or bio…" value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ position: "relative" }}>
              <select value={disciplineFilter} onChange={e => setDisciplineFilter(e.target.value)} style={{ ...btnOutline, padding: "10px 32px 10px 14px", fontSize: 13, appearance: "none", cursor: "pointer", ...mono }}>
                {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: c.textSoft }}><ChevIco /></span>
            </div>
          </div>
        </div>

        {/* Member Grid */}
        {filtered.length > 0 ? (
          <div className="fm-member-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {filtered.map(m => (
              <div key={m.id} className="fm-member-card" onClick={() => setExpandedMember(expandedMember === m.id ? null : m.id)} style={{
                ...cardStyle, padding: "20px 22px", cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar name={m.name || m.email?.split("@")[0] || "Member"} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{m.name || m.email?.split("@")[0] || "Member"}</div>
                    <div style={{ ...mono, fontSize: 11, color: c.textSoft, marginTop: 1 }}>{m.discipline || m.email || "Creative"}</div>
                  </div>
                  <span style={{ color: c.textSoft, transform: expandedMember === m.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}><ChevIco /></span>
                </div>

                {expandedMember === m.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${c.border}`, animation: "fadeIn 0.15s ease" }}>
                    {m.bio && <p style={{ color: c.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{m.bio}</p>}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                      {m.portfolio && (
                        <a href={m.portfolio} target="_blank" rel="noopener noreferrer" style={{ ...mono, fontSize: 11, color: c.red, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                          <ExtIco /> Portfolio
                        </a>
                      )}
                      {m.created_at && (
                        <span style={{ ...mono, fontSize: 11, color: c.textSoft }}>Joined {fmtJoined(m.created_at)}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: c.textSoft }}>
            <SearchIco s={32} />
            <p style={{ ...serif, fontSize: 20, marginTop: 16, color: c.text }}>No members found</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Try a different search or filter.</p>
            <button onClick={() => { setSearch(""); setDisciplineFilter("All"); }} style={{ ...btnOutline, marginTop: 16, fontSize: 13 }}>Clear filters</button>
          </div>
        )}
      </div>

      <footer style={{ borderTop: `1px solid ${c.border}`, padding: 24, background: c.surface, textAlign: "center" }}>
        <p style={{ ...mono, fontSize: 11, color: c.textSoft }}>Form & Meaning · Design is not decoration. It's a decision. · © 2026</p>
      </footer>
    </div>
  );
}
