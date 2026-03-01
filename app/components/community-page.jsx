"use client";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — COMMUNITY DIRECTORY + PROFILE (File 5 of N)
// Member directory with search, and profile editing
// ═══════════════════════════════════════════════════════════════

export default function CommunityPage() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("community"); // community | profile
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  // ─── Mock Data ─────────────────────────────────────────────
  const currentUser = {
    name: "Mannorr", email: "ag.oluwanifemi@gmail.com",
    discipline: "Visual & Brand Design",
    bio: "Building Form & Meaning. I believe design is a problem-solving tool, not decoration.",
    portfolio: "https://mannorr.com",
    joined: "Feb 2026",
  };

  const members = [
    { id: 1, name: "Praise Max-Oti", discipline: "Brand Design", bio: "Building brands that speak before they're spoken about.", portfolio: "https://praise.design", joined: "Feb 2026" },
    { id: 2, name: "Joshua Ibiyinka", discipline: "UI/UX Design", bio: "Obsessed with interfaces that feel invisible. Design should serve, not impress.", portfolio: "", joined: "Feb 2026" },
    { id: 3, name: "Kosi Okoye", discipline: "Motion Design", bio: "Making things move with meaning. Every frame has a purpose.", portfolio: "https://kosi.works", joined: "Feb 2026" },
    { id: 4, name: "Samuel Elijah", discipline: "Product Design", bio: "Solving problems people didn't know they had. Systems thinker.", portfolio: "", joined: "Feb 2026" },
    { id: 5, name: "Anita Ojone Ogu", discipline: "Visual Design", bio: "Every pixel has a purpose. I don't design to decorate — I design to communicate.", portfolio: "https://anita.co", joined: "Feb 2026" },
    { id: 6, name: "David Triumph", discipline: "Graphic Design", bio: "Less noise, more signal. Clarity is the ultimate sophistication.", portfolio: "", joined: "Feb 2026" },
    { id: 7, name: "Kailande Cassamajor", discipline: "Brand Identity", bio: "Crafting identities that carry weight. Design with backbone.", portfolio: "https://kailande.design", joined: "Feb 2026" },
    { id: 8, name: "Naphtali Ewubajo", discipline: "Visual Design", bio: "I think in systems, I speak in visuals. Making work that compounds.", portfolio: "", joined: "Feb 2026" },
    { id: 9, name: "Praise Ajibade", discipline: "UI/UX Design", bio: "User-first, always. Building products that respect people's time.", portfolio: "https://praiseajibade.com", joined: "Feb 2026" },
    { id: 10, name: "Faji Daniel", discipline: "Brand Design", bio: "Brands are promises. I help keep them.", portfolio: "", joined: "Feb 2026" },
    { id: 11, name: "Ephraim Munachiso", discipline: "Product Design", bio: "From research to interface. The problem comes first, always.", portfolio: "https://ephraim.design", joined: "Feb 2026" },
    { id: 12, name: "Olotu Nifemi", discipline: "Motion Design", bio: "Movement with meaning. Bringing stories to life frame by frame.", portfolio: "", joined: "Feb 2026" },
  ];

  const disciplines = ["All", ...new Set(members.map(m => m.discipline))].sort();

  const [search, setSearch] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("All");
  const [expandedMember, setExpandedMember] = useState(null);

  const filtered = members.filter(m => {
    const matchSearch = !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.discipline.toLowerCase().includes(search.toLowerCase()) ||
      m.bio.toLowerCase().includes(search.toLowerCase());
    const matchDiscipline = disciplineFilter === "All" || m.discipline === disciplineFilter;
    return matchSearch && matchDiscipline;
  });

  // ─── Brand Tokens ──────────────────────────────────────────
  const c = dark ? {
    bg: "#111111", bg2: "#1A1A1A", bg3: "#222222",
    surface: "rgba(255,255,255,0.04)", surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    text: "#F5F0EB", textMuted: "rgba(245,240,235,0.6)", textSoft: "rgba(245,240,235,0.35)",
    red: "#E63228", redSoft: "rgba(230,50,40,0.12)", redBorder: "rgba(230,50,40,0.3)",
    mint: "#3EDEB5", mintSoft: "rgba(62,222,181,0.1)", mintBorder: "rgba(62,222,181,0.25)",
    navBg: "rgba(17,17,17,0.88)", cardBg: "#1A1A1A", inputBg: "#1A1A1A", grain: 0.06,
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
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
  const cardStyle = { background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 8, transition: "all 0.15s ease" };
  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 4,
    border: `1.5px solid ${c.borderStrong}`, background: c.inputBg,
    color: c.text, fontSize: 14, ...sans, outline: "none",
    transition: "border-color 0.15s ease",
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: c.textSoft, ...mono,
    display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em",
  };

  // ─── Icons ─────────────────────────────────────────────────
  const Ico = ({ d, size = 20, sw = 2, fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const Sun = () => <Ico d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />;
  const Moon = () => <Ico d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />;
  const MenuI = () => <Ico size={22} d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
  const XI = () => <Ico size={22} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
  const SearchI = ({ s = 16 }) => <Ico size={s} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />;
  const CheckI = ({ s = 14 }) => <Ico size={s} sw={2.5} d={<polyline points="20 6 9 17 4 12"/>} />;
  const LinkI = ({ s = 13 }) => <Ico size={s} d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>} />;
  const HomeI = ({ s = 16 }) => <Ico size={s} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />;
  const BookI = ({ s = 16 }) => <Ico size={s} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>} />;
  const UsersI = ({ s = 16 }) => <Ico size={s} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />;
  const CalI = ({ s = 16 }) => <Ico size={s} d={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />;
  const UserI = ({ s = 16 }) => <Ico size={s} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />;
  const LogoutI = ({ s = 16 }) => <Ico size={s} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />;
  const CalendarI = ({ s = 12 }) => <Ico size={s} d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />;
  const MailI = ({ s = 14 }) => <Ico size={s} d={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>} />;

  // ─── Avatar ────────────────────────────────────────────────
  const Avatar = ({ name, size = 40 }) => {
    const colors = ["#E63228","#3EDEB5","#D4A843","#4A6FD9","#9B6FCF","#E07BAC","#5CB8B2","#D46B5D"];
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

  // ═══════════════════════════════════════════════════════════
  // COMMUNITY DIRECTORY
  // ═══════════════════════════════════════════════════════════
  const CommunityView = () => (
    <div style={{ ...maxW, padding: "36px 24px 80px" }}>
      {/* Header */}
      <div className="au" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          <div>
            <h1 style={{ ...serif, fontSize: 32, lineHeight: 1.1 }}>Community</h1>
            <p style={{ color: c.textMuted, fontSize: 14, marginTop: 4 }}>
              Creatives who build with integrity. Find collaborators, mentors, and friends.
            </p>
          </div>
          <div style={{ ...mono, fontSize: 12, color: c.textSoft }}>
            {members.length} members
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 360 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: c.textSoft }}>
              <SearchI />
            </span>
            <input
              type="text" placeholder="Search by name, discipline, or bio…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 40 }}
              aria-label="Search members"
            />
          </div>
          <select
            value={disciplineFilter}
            onChange={e => setDisciplineFilter(e.target.value)}
            style={{
              ...inputStyle, width: "auto", padding: "11px 32px 11px 14px",
              cursor: "pointer", appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
            aria-label="Filter by discipline"
          >
            {disciplines.map(d => (
              <option key={d} value={d}>{d === "All" ? "All disciplines" : d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Member Grid */}
      <div className="au1" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 14,
      }}>
        {filtered.map((m, i) => (
          <div key={m.id} style={{
            ...cardStyle, padding: 0, overflow: "hidden",
            borderColor: expandedMember === m.id ? c.redBorder : c.border,
          }}>
            <div
              onClick={() => setExpandedMember(expandedMember === m.id ? null : m.id)}
              style={{ padding: "20px 22px", cursor: "pointer" }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <Avatar name={m.name} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{m.name}</h3>
                  </div>
                  <div style={{
                    ...mono, fontSize: 11, fontWeight: 600, color: c.red,
                    marginBottom: 6,
                  }}>{m.discipline}</div>
                  <p style={{
                    color: c.textMuted, fontSize: 13, lineHeight: 1.55,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: expandedMember === m.id ? 10 : 2,
                    WebkitBoxOrient: "vertical",
                  }}>{m.bio}</p>
                </div>
              </div>

              {/* Expanded details */}
              {expandedMember === m.id && (
                <div style={{
                  marginTop: 14, paddingTop: 14, borderTop: `1px solid ${c.border}`,
                  display: "grid", gap: 10, animation: "fadeIn 0.2s ease",
                }}>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {m.portfolio && (
                      <a href={m.portfolio} target="_blank" rel="noreferrer" style={{
                        display: "flex", alignItems: "center", gap: 5,
                        fontSize: 12, color: c.red, ...mono, textDecoration: "none",
                        fontWeight: 500,
                      }}>
                        <LinkI /> Portfolio
                      </a>
                    )}
                    <span style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 12, color: c.textSoft, ...mono,
                    }}>
                      <CalendarI /> Joined {m.joined}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: c.textSoft }}>
          <UsersI s={32} />
          <p style={{ ...serif, fontSize: 20, marginTop: 16, color: c.text }}>No members found</p>
          <p style={{ fontSize: 14, marginTop: 4 }}>Try a different search or filter.</p>
          <button onClick={() => { setSearch(""); setDisciplineFilter("All"); }} style={{ ...btnOutline, marginTop: 16, fontSize: 13 }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // PROFILE PAGE
  // ═══════════════════════════════════════════════════════════
  const ProfileView = () => {
    const [name, setName] = useState(currentUser.name);
    const [discipline, setDiscipline] = useState(currentUser.discipline);
    const [bio, setBio] = useState(currentUser.bio);
    const [portfolio, setPortfolio] = useState(currentUser.portfolio);
    const [saved, setSaved] = useState(false);
    const [pwMode, setPwMode] = useState(false);
    const [oldPw, setOldPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [pwMsg, setPwMsg] = useState("");

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };
    const handlePwChange = () => {
      if (!oldPw.trim() || !newPw.trim()) { setPwMsg("Fill in both fields."); return; }
      if (newPw.length < 6) { setPwMsg("New password must be at least 6 characters."); return; }
      setPwMsg(""); setSaved(true); setOldPw(""); setNewPw("");
      setTimeout(() => setSaved(false), 2200);
    };

    return (
      <div style={{ ...maxW, padding: "36px 24px 80px", maxWidth: 640 }}>
        <div className="au" style={{ marginBottom: 28 }}>
          <h1 style={{ ...serif, fontSize: 32, lineHeight: 1.1 }}>Your profile</h1>
          <p style={{ color: c.textMuted, fontSize: 14, marginTop: 4 }}>
            This is how other members see you in the community directory.
          </p>
        </div>

        {/* Profile Card */}
        <div className="au1" style={{ ...cardStyle, padding: 32, marginBottom: 20 }}>
          {/* Avatar + Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${c.border}` }}>
            <Avatar name={currentUser.name} size={72} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, ...serif }}>{currentUser.name}</div>
              <div style={{ ...mono, fontSize: 12, color: c.textSoft, marginTop: 2 }}>{currentUser.email}</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                ...mono, fontSize: 10, color: c.textSoft, marginTop: 6,
              }}>
                <CalendarI /> Member since {currentUser.joined}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ display: "grid", gap: 18 }}>
            <div>
              <label htmlFor="p-name" style={labelStyle}>Display name</label>
              <input id="p-name" type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label htmlFor="p-disc" style={labelStyle}>Discipline</label>
              <input id="p-disc" type="text" value={discipline} onChange={e => setDiscipline(e.target.value)} placeholder="e.g. Brand Design, UI/UX, Motion…" style={inputStyle} />
              <p style={{ ...mono, fontSize: 10, color: c.textSoft, marginTop: 5 }}>
                This appears as your tag in the member directory
              </p>
            </div>

            <div>
              <label htmlFor="p-bio" style={labelStyle}>Bio</label>
              <textarea
                id="p-bio" rows={3} value={bio} onChange={e => setBio(e.target.value)}
                placeholder="A short line about you and your work…"
                style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.6 }}
              />
              <p style={{ ...mono, fontSize: 10, color: c.textSoft, marginTop: 5 }}>
                {bio.length}/200 characters
              </p>
            </div>

            <div>
              <label htmlFor="p-port" style={labelStyle}>Portfolio link</label>
              <input id="p-port" type="url" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://your-portfolio.com" style={inputStyle} />
            </div>

            {/* Save */}
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              <button onClick={handleSave} style={{
                ...btnRed,
                background: saved ? c.mint : c.red,
                transition: "all 0.25s ease",
              }}>
                {saved ? <><CheckI s={15} /> Saved</> : "Save profile"}
              </button>
              <button onClick={() => setActivePage("community")} style={btnOutline}>
                View directory
              </button>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="au2" style={{ ...cardStyle, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: pwMode ? 18 : 0 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Password</h3>
              {!pwMode && <p style={{ fontSize: 13, color: c.textSoft, marginTop: 2 }}>Change your account password</p>}
            </div>
            <button onClick={() => { setPwMode(!pwMode); setPwMsg(""); }} style={{
              ...btnGhost, fontSize: 12, color: pwMode ? c.textSoft : c.red,
            }}>
              {pwMode ? "Cancel" : "Change"}
            </button>
          </div>

          {pwMode && (
            <div style={{ display: "grid", gap: 14, animation: "fadeIn 0.2s ease" }}>
              <div>
                <label htmlFor="pw-old" style={labelStyle}>Current password</label>
                <input id="pw-old" type="password" value={oldPw} onChange={e => { setOldPw(e.target.value); setPwMsg(""); }} placeholder="••••••••" style={inputStyle} autoComplete="current-password" />
              </div>
              <div>
                <label htmlFor="pw-new" style={labelStyle}>New password</label>
                <input id="pw-new" type="password" value={newPw} onChange={e => { setNewPw(e.target.value); setPwMsg(""); }} placeholder="At least 6 characters" style={inputStyle} autoComplete="new-password" />
              </div>
              {pwMsg && (
                <div style={{
                  padding: "10px 14px", borderRadius: 4,
                  background: c.redSoft, border: `1px solid ${c.redBorder}`,
                  color: c.red, fontSize: 13, fontWeight: 500,
                }}>{pwMsg}</div>
              )}
              <button onClick={handlePwChange} style={{ ...btnRed, fontSize: 13, alignSelf: "flex-start" }}>
                Update password
              </button>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="au3" style={{
          ...cardStyle, padding: 24, marginTop: 20,
          borderColor: c.redBorder, borderLeft: `3px solid ${c.red}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Log out</h3>
              <p style={{ fontSize: 13, color: c.textSoft, marginTop: 2 }}>Sign out of your account on this device.</p>
            </div>
            <button style={{
              ...btnOutline, fontSize: 12, borderColor: c.redBorder, color: c.red,
            }}>
              <LogoutI s={14} /> Log out
            </button>
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
        input:focus-visible, textarea:focus-visible, select:focus-visible { outline: none; border-color: ${c.red} !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        }
        .au { animation: fadeUp 0.5s ease both; }
        .au1 { animation: fadeUp 0.5s ease 0.06s both; }
        .au2 { animation: fadeUp 0.5s ease 0.12s both; }
        .au3 { animation: fadeUp 0.5s ease 0.18s both; }
        @media (max-width: 900px) {
          .fm-desk-nav { display: none !important; }
          .fm-mob-toggle { display: flex !important; }
        }
        @media (min-width: 901px) { .fm-mob-toggle { display: none !important; } }
        @media (max-width: 680px) {
          .fm-member-grid { grid-template-columns: 1fr !important; }
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
              <button key={link.key} onClick={() => { if (link.key === "community") setActivePage("community"); }} style={{
                ...btnGhost, gap: 6,
                color: (link.key === "community" && activePage === "community") ? c.red : c.textMuted,
                fontWeight: (link.key === "community" && activePage === "community") ? 700 : 500,
              }}>
                <span style={{ color: (link.key === "community" && activePage === "community") ? c.red : c.textSoft }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
            <span style={{ width: 1, height: 20, background: c.border, margin: "0 6px" }} />
            <button onClick={() => setActivePage("profile")} style={{
              ...btnGhost, padding: "4px 8px",
              boxShadow: activePage === "profile" ? `0 0 0 2px ${c.red}` : "none",
              borderRadius: "50%",
            }}>
              <Avatar name={currentUser.name} />
            </button>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }} aria-label="Toggle theme">
              {dark ? <Sun /> : <Moon />}
            </button>
          </nav>
          <div className="fm-mob-toggle" style={{ display: "none", alignItems: "center", gap: 4 }}>
            <button onClick={toggle} style={{ ...btnGhost, padding: 8 }}>{dark ? <Sun /> : <Moon />}</button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ ...btnGhost, padding: 8 }}>
              {menuOpen ? <XI /> : <MenuI />}
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
              <button key={link.key} onClick={() => { setMenuOpen(false); if (link.key === "community") setActivePage("community"); }} style={{
                ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%",
                justifyContent: "flex-start", gap: 12,
                color: (link.key === "community" && activePage === "community") ? c.red : c.textMuted,
              }}>{link.icon} {link.label}</button>
            ))}
            <div style={{ height: 1, background: c.border, margin: "8px 0" }} />
            <button onClick={() => { setMenuOpen(false); setActivePage("profile"); }} style={{
              ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%",
              justifyContent: "flex-start", gap: 12,
              color: activePage === "profile" ? c.red : c.textMuted,
            }}><UserI /> Profile</button>
            <button style={{ ...btnGhost, fontSize: 17, padding: "16px 8px", width: "100%", justifyContent: "flex-start", gap: 12, color: c.red }}>
              <LogoutI /> Log out
            </button>
          </div>
        )}
      </header>

      {/* ═══ PAGE CONTENT ═════════════════════════════════════ */}
      {activePage === "community" ? <CommunityView /> : <ProfileView />}

      {/* Toast */}
      {/* (Handled within ProfileView via saved state) */}

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
