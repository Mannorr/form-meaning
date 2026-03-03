"use client";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// FORM & MEANING — ADMIN PANEL (File 7 of N)
// Overview, Members, Content, Events, Announcements management
// ═══════════════════════════════════════════════════════════════

export default function AdminPanel() {
  const [theme, setTheme] = useState("light");
  const [section, setSection] = useState("overview"); // overview | members | content | events | announcements
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  // ─── Mock Data ─────────────────────────────────────────────
  const [members, setMembers] = useState([]);

  // Load real members from API on mount
  const [membersLoaded, setMembersLoaded] = useState(false);
  if (!membersLoaded && typeof window !== "undefined") {
    setMembersLoaded(true);
    fetch("/api/admin/members").then(r => r.json()).then(d => { if (d.data) setMembers(d.data); }).catch(() => {});
  }

  const [contentItems, setContentItems] = useState([]);

  // Load real content from API on mount
  const [contentLoaded, setContentLoaded] = useState(false);
  if (!contentLoaded && typeof window !== "undefined") {
    setContentLoaded(true);
    fetch("/api/admin/content").then(r => r.json()).then(d => { if (d.data) setContentItems(d.data); }).catch(() => {});
  }

  const [eventItems, setEventItems] = useState([]);

  // Load real events from API on mount
  const [eventsLoaded, setEventsLoaded] = useState(false);
  if (!eventsLoaded && typeof window !== "undefined") {
    setEventsLoaded(true);
    fetch("/api/admin/events").then(r => r.json()).then(d => { if (d.data) setEventItems(d.data); }).catch(() => {});
  }

  const [announcementItems, setAnnouncementItems] = useState([]);

  // Load real announcements from API on mount
  const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
  if (!announcementsLoaded && typeof window !== "undefined") {
    setAnnouncementsLoaded(true);
    fetch("/api/admin/announcements").then(r => r.json()).then(d => { if (d.data) setAnnouncementItems(d.data); }).catch(() => {});
  }

  // ─── State for modals/forms ────────────────────────────────
  const [memberSearch, setMemberSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");
  const [showAddContent, setShowAddContent] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2400); };

  const filteredMembers = members.filter(m => {
    const matchSearch = !memberSearch.trim() || (m.name || "").toLowerCase().includes(memberSearch.toLowerCase()) || (m.email || "").toLowerCase().includes(memberSearch.toLowerCase());
    const matchFilter = memberFilter === "all" || m.status === memberFilter;
    return matchSearch && matchFilter;
  });

  const toggleMemberStatus = async (id, newStatus) => {
    try {
      await fetch("/api/admin/members", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) });
      setMembers(ms => ms.map(m => m.id === id ? { ...m, status: newStatus } : m));
      showToast(`Member ${newStatus === "active" ? "activated" : newStatus === "suspended" ? "suspended" : "updated"}.`);
    } catch (e) { showToast("Error updating member."); }
  };

  const removeMember = async (id) => {
    if (!confirm("Remove this member? This cannot be undone.")) return;
    try {
      await fetch("/api/admin/members", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setMembers(ms => ms.filter(m => m.id !== id));
      showToast("Member removed.");
    } catch (e) { showToast("Error removing member."); }
  };

  const toggleContentStatus = async (id) => {
    const item = contentItems.find(i => i.id === id);
    if (!item) return;
    const newStatus = item.status === "published" ? "draft" : "published";
    try {
      await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) });
      setContentItems(items => items.map(i => i.id === id ? { ...i, status: newStatus } : i));
      showToast("Content updated.");
    } catch (e) { showToast("Error updating."); }
  };

  const togglePin = async (id) => {
    const item = announcementItems.find(i => i.id === id);
    if (!item) return;
    try {
      await fetch("/api/admin/announcements", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, pinned: !item.pinned }) });
      setAnnouncementItems(items => items.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i));
      showToast("Announcement updated.");
    } catch (e) { showToast("Error updating."); }
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
    navBg: "rgba(17,17,17,0.95)", cardBg: "#1A1A1A", inputBg: "#1A1A1A", sidebarBg: "#151515", grain: 0.04,
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    amber: "#B8922A", amberSoft: "rgba(184,146,42,0.08)", amberBorder: "rgba(184,146,42,0.2)",
    navBg: "rgba(245,240,235,0.95)", cardBg: "#FFFFFF", inputBg: "#FFFFFF", sidebarBg: "#FFFEFA", grain: 0.03,
  };

  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const sans = { fontFamily: "'Syne', 'Helvetica Neue', sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };

  const btnBase = { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.15s ease", ...sans };
  const btnRed = { ...btnBase, background: c.red, color: "#fff" };
  const btnMint = { ...btnBase, background: c.mint, color: "#111" };
  const btnOutline = { ...btnBase, background: "transparent", color: c.text, border: `1.5px solid ${c.borderStrong}` };
  const btnGhost = { ...btnBase, background: "transparent", color: c.textMuted, padding: "8px 10px" };
  const btnDanger = { ...btnBase, background: "transparent", color: c.red, border: `1px solid ${c.redBorder}`, fontSize: 11 };
  const cardStyle = { background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 8 };
  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 4, border: `1.5px solid ${c.borderStrong}`, background: c.inputBg, color: c.text, fontSize: 13, ...sans, outline: "none" };
  const labelStyle = { fontSize: 10, fontWeight: 600, color: c.textSoft, ...mono, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" };

  // ─── Icons ─────────────────────────────────────────────────
  const Ico = ({ d, size = 18, sw = 2, fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
  const Sun = () => <Ico d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />;
  const Moon = () => <Ico d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />;
  const MenuI = () => <Ico size={22} d={<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>} />;
  const XI = () => <Ico size={22} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
  const CheckI = ({ s = 14 }) => <Ico size={s} sw={2.5} d={<polyline points="20 6 9 17 4 12"/>} />;
  const PlusI = ({ s = 14 }) => <Ico size={s} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />;
  const SearchI = ({ s = 15 }) => <Ico size={s} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />;
  const TrashI = ({ s = 13 }) => <Ico size={s} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>} />;
  const PinI = ({ s = 13 }) => <Ico size={s} fill="currentColor" sw={0} d={<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>} />;
  const GridI = () => <Ico d={<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>} />;
  const UsersI = () => <Ico d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />;
  const BookI = () => <Ico d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>} />;
  const CalI = () => <Ico d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />;
  const MegaI = () => <Ico d={<><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>} />;
  const LogoutI = () => <Ico d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />;
  const ExtI = ({ s = 12 }) => <Ico size={s} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>} />;

  // ─── Status badge ──────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const map = {
      active: { bg: c.mintSoft, color: c.mint, border: c.mintBorder },
      suspended: { bg: c.amberSoft, color: c.amber, border: c.amberBorder },
      pending: { bg: c.redSoft, color: c.red, border: c.redBorder },
      published: { bg: c.mintSoft, color: c.mint, border: c.mintBorder },
      draft: { bg: c.surface, color: c.textSoft, border: c.border },
      upcoming: { bg: c.mintSoft, color: c.mint, border: c.mintBorder },
      completed: { bg: c.surface, color: c.textSoft, border: c.border },
    };
    const s = map[status] || map.draft;
    return (
      <span style={{
        ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px",
        borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.04em",
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      }}>{status}</span>
    );
  };

  // ─── Sidebar nav ───────────────────────────────────────────
  const sidebarLinks = [
    { key: "overview", label: "Overview", icon: <GridI /> },
    { key: "members", label: "Members", icon: <UsersI />, count: members.length },
    { key: "content", label: "Content", icon: <BookI />, count: contentItems.length },
    { key: "events", label: "Events", icon: <CalI />, count: eventItems.length },
    { key: "announcements", label: "Announcements", icon: <MegaI />, count: announcementItems.length },
  ];

  // ─── Stats ─────────────────────────────────────────────────
  const stats = [
    { label: "Total members", value: members.filter(m => m.status === "active").length, color: c.mint },
    { label: "Pending", value: members.filter(m => m.status === "pending").length, color: c.amber },
    { label: "Content items", value: contentItems.filter(i => i.status === "published").length, color: c.red },
    { label: "Upcoming events", value: eventItems.filter(e => e.status === "upcoming").length, color: c.mint },
  ];

  // ═══════════════════════════════════════════════════════════
  // SECTION RENDERERS
  // ═══════════════════════════════════════════════════════════

  const Overview = () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <h2 style={{ ...serif, fontSize: 26, marginBottom: 4 }}>Admin Dashboard</h2>
        <p style={{ color: c.textMuted, fontSize: 13 }}>Manage your community, content, and events.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="fm-stat-grid">
        {stats.map((s, i) => (
          <div key={i} style={{ ...cardStyle, padding: 20 }}>
            <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ ...mono, fontSize: 10, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="fm-overview-grid">
        <div style={{ ...cardStyle, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Recent members</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {members.slice(-4).reverse().map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ ...mono, fontSize: 10, color: c.textSoft }}>{m.email}</div>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...cardStyle, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Upcoming events</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {eventItems.filter(e => e.status === "upcoming").map(e => (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                  <div style={{ ...mono, fontSize: 10, color: c.textSoft }}>{e.date} · {e.rsvps} RSVPs</div>
                </div>
                <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{e.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...cardStyle, padding: 22 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Quick actions</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setSection("members")} style={btnOutline}><UsersI /> Manage members</button>
          <button onClick={() => { setSection("content"); setShowAddContent(true); }} style={btnOutline}><PlusI /> Add content</button>
          <button onClick={() => { setSection("events"); setShowAddEvent(true); }} style={btnOutline}><PlusI /> Create event</button>
          <button onClick={() => { setSection("announcements"); setShowAddAnnouncement(true); }} style={btnOutline}><PlusI /> Post announcement</button>
          <button onClick={() => window.location.href="/"} style={btnOutline}><ExtI /> View site</button>
        </div>
      </div>
    </div>
  );

  const Members = () => {
    const [addMode, setAddMode] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [addBusy, setAddBusy] = useState(false);

    const addMember = async () => {
      if (!newEmail.trim()) return showToast("Email is required.");
      setAddBusy(true);
      try {
        // Create membership row
        const res = await fetch("/api/admin/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newEmail.trim().toLowerCase(), name: newName.trim(), status: "active", paid: true, admin_approved: true }) });
        if (!res.ok) { const j = await res.json(); showToast(j.error || "Failed to add."); setAddBusy(false); return; }
        const { data } = await res.json();
        // Create auth account with shared password
        await fetch("/api/admin/setup-passwords-single", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newEmail.trim().toLowerCase() }) }).catch(() => {});
        setMembers(ms => [data, ...ms]);
        setNewEmail(""); setNewName(""); setAddMode(false);
        showToast("Member added.");
      } catch (e) { showToast("Error adding member."); }
      setAddBusy(false);
    };

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ ...serif, fontSize: 22 }}>Members ({members.length})</h2>
          <button onClick={() => setAddMode(!addMode)} style={btnRed}><PlusI s={13} /> Add member</button>
        </div>

        {addMode && (
          <div style={{ ...cardStyle, padding: 22, borderColor: c.redBorder, animation: "fadeIn 0.2s ease" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Add new member</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="fm-form-grid">
                <div><label style={labelStyle}>Email (required)</label><input style={inputStyle} placeholder="member@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} /></div>
                <div><label style={labelStyle}>Name (optional)</label><input style={inputStyle} placeholder="Full name" value={newName} onChange={e => setNewName(e.target.value)} /></div>
              </div>
              <p style={{ ...mono, fontSize: 11, color: c.textSoft }}>Password will be set to: formmeaning1!</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addMember} disabled={addBusy} style={btnRed}>{addBusy ? "Adding..." : "Add member"}</button>
                <button onClick={() => setAddMode(false)} style={btnGhost}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: c.textSoft }}><SearchI /></span>
            <input type="text" placeholder="Search name or email..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>
          <div style={{ display: "flex", gap: 3, border: `1px solid ${c.border}`, borderRadius: 4, overflow: "hidden" }}>
            {["all","active","pending","suspended"].map(f => (
              <button key={f} onClick={() => setMemberFilter(f)} style={{
                ...btnGhost, borderRadius: 0, fontSize: 11, padding: "7px 12px",
                background: memberFilter === f ? c.redSoft : "transparent",
                color: memberFilter === f ? c.red : c.textSoft,
                fontWeight: memberFilter === f ? 700 : 500, ...mono, textTransform: "capitalize", border: "none",
              }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                  {["Name","Email","Discipline","Status","Joined","Actions"].map(h => (
                    <th key={h} style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(m => (
                  <tr key={m.id} style={{ borderBottom: `1px solid ${c.border}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{m.name || m.email?.split("@")[0] || "Member"}</td>
                    <td style={{ padding: "12px 16px", color: c.textMuted, ...mono, fontSize: 11 }}>{m.email}</td>
                    <td style={{ padding: "12px 16px", color: c.textMuted }}>{m.discipline || "\u2014"}</td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={m.status} /></td>
                    <td style={{ padding: "12px 16px", ...mono, fontSize: 11, color: c.textSoft }}>{m.created_at ? new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {m.status === "pending" && <button onClick={() => toggleMemberStatus(m.id, "active")} style={{ ...btnMint, padding: "5px 10px", fontSize: 11 }}>Approve</button>}
                        {m.status === "active" && <button onClick={() => toggleMemberStatus(m.id, "suspended")} style={{ ...btnGhost, fontSize: 11, color: c.amber }}>Suspend</button>}
                        {m.status === "suspended" && <button onClick={() => toggleMemberStatus(m.id, "active")} style={{ ...btnGhost, fontSize: 11, color: c.mint }}>Reactivate</button>}
                        <button onClick={() => removeMember(m.id)} style={{ ...btnGhost, fontSize: 11, color: c.red, padding: "5px 8px" }}><TrashI /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };


  const Content = () => {
    const [form, setForm] = useState({ title: "", speaker: "", type: "conference", day: "", video_url: "", file_url: "", format: "PDF", thumbnail_url: "", description: "" });
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);

    const getYtId = (url) => { const m = (url||"").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/); return m ? m[1] : null; };
    const ytThumb = getYtId(form.video_url);
    const isResource = form.type === "resource";

    const resetForm = () => { setForm({ title: "", speaker: "", type: "conference", day: "", video_url: "", file_url: "", format: "PDF", thumbnail_url: "", description: "" }); setEditing(null); setShowAddContent(false); };

    const saveContent = async (status) => {
      if (!form.title.trim()) return showToast("Title is required.");
      setSaving(true);
      try {
        const body = { title: form.title, speaker: form.speaker, type: form.type, video_url: form.video_url, file_url: form.file_url, format: form.format, thumbnail_url: form.thumbnail_url, description: form.description, status, day: form.day ? parseInt(form.day) : null };
        const method = editing ? "PATCH" : "POST";
        if (editing) body.id = editing;
        const res = await fetch("/api/admin/content", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("Failed");
        const { data } = await res.json();
        if (editing) {
          setContentItems(items => items.map(i => i.id === editing ? data : i));
        } else {
          setContentItems(items => [data, ...items]);
        }
        resetForm();
        showToast(editing ? "Content updated." : "Content added.");
      } catch (e) { showToast("Error saving. Try again."); }
      setSaving(false);
    };

    const deleteContent = async (id) => {
      if (!confirm("Delete this content?")) return;
      try {
        await fetch("/api/admin/content", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        setContentItems(items => items.filter(i => i.id !== id));
        showToast("Content deleted.");
      } catch (e) { showToast("Error deleting."); }
    };

    const startEdit = (item) => {
      setForm({ title: item.title, speaker: item.speaker || "", type: item.type || "conference", day: item.day ? String(item.day) : "", video_url: item.video_url || "", file_url: item.file_url || "", format: item.format || "PDF", thumbnail_url: item.thumbnail_url || "", description: item.description || "" });
      setEditing(item.id);
      setShowAddContent(true);
    };

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ ...serif, fontSize: 22 }}>Content ({contentItems.length})</h2>
          <button onClick={() => { resetForm(); setShowAddContent(!showAddContent); }} style={btnRed}><PlusI s={13} /> Add content</button>
        </div>

        {showAddContent && (
          <div style={{ ...cardStyle, padding: 22, borderColor: c.redBorder, animation: "fadeIn 0.2s ease" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{editing ? "Edit content" : "Add new content"}</h3>
            <div style={{ display: "grid", gap: 12 }}>

              {/* Type selector first */}
              <div>
                <label style={labelStyle}>Content type</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="conference">Conference Video</option>
                  <option value="recording">Recording</option>
                  <option value="resource">Resource / PDF</option>
                </select>
              </div>

              {/* YouTube URL — for videos */}
              {!isResource && (
                <div>
                  <label style={labelStyle}>YouTube URL</label>
                  <input style={inputStyle} placeholder="https://www.youtube.com/watch?v=..." value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} />
                </div>
              )}

              {/* Live thumbnail preview for videos */}
              {!isResource && ytThumb && (
                <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${c.border}`, maxWidth: 400 }}>
                  <img src={`https://img.youtube.com/vi/${ytThumb}/hqdefault.jpg`} alt="YouTube thumbnail" style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }} />
                  <div style={{ padding: "8px 12px", background: c.surface, ...mono, fontSize: 11, color: c.mint }}>\u2713 Thumbnail detected</div>
                </div>
              )}

              {/* File URL + Format — for resources */}
              {isResource && (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }} className="fm-form-grid">
                  <div>
                    <label style={labelStyle}>File URL (Google Drive, Dropbox, etc.)</label>
                    <input style={inputStyle} placeholder="https://drive.google.com/file/d/..." value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Format</label>
                    <select style={{ ...inputStyle, cursor: "pointer" }} value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
                      <option value="PDF">PDF</option>
                      <option value="DOC">DOC</option>
                      <option value="Slides">Slides</option>
                      <option value="Notion">Notion</option>
                      <option value="Link">Link</option>
                    </select>
                  </div>
                </div>
              )}

              {isResource && form.file_url && (
                <div style={{ padding: "10px 14px", borderRadius: 6, background: c.mintSoft, border: `1px solid ${c.mintBorder}`, ...mono, fontSize: 11, color: c.mint }}>
                  \u2713 File link set \u2014 members will see it in the PDF viewer
                </div>
              )}

              {/* Thumbnail URL — for resources */}
              {isResource && (
                <div>
                  <label style={labelStyle}>Thumbnail URL (optional \u2014 cover image for the card)</label>
                  <input style={inputStyle} placeholder="https://your-supabase-url.storage/.../thumbnail.jpg" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="fm-form-grid">
                <div><label style={labelStyle}>Title</label><input style={inputStyle} placeholder={isResource ? "e.g. Problem-Solving Framework" : "e.g. The Problem You Were Hired to Solve"} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div><label style={labelStyle}>{isResource ? "Author" : "Speaker"}</label><input style={inputStyle} placeholder={isResource ? "e.g. Form & Meaning" : "e.g. Mannorr"} value={form.speaker} onChange={e => setForm(f => ({ ...f, speaker: e.target.value }))} /></div>
              </div>

              {!isResource && (
                <div><label style={labelStyle}>Day (conference only)</label><input style={inputStyle} type="number" placeholder="1, 2, 3\u2026" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} /></div>
              )}

              <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder={isResource ? "What this resource covers\u2026" : "What this video covers\u2026"} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => saveContent("published")} disabled={saving} style={btnRed}>{saving ? "Saving\u2026" : editing ? "Update & Publish" : "Publish"}</button>
                <button onClick={() => saveContent("draft")} disabled={saving} style={btnOutline}>{editing ? "Update as Draft" : "Save draft"}</button>
                <button onClick={resetForm} style={btnGhost}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Content list */}
        <div style={{ display: "grid", gap: 10 }}>
          {contentItems.length === 0 && (
            <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}>
              <p style={{ color: c.textMuted, fontSize: 14 }}>No content yet. Add your first video or resource above.</p>
            </div>
          )}
          {contentItems.map(item => {
            const vid = ((item.video_url||"").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/) || [])[1];
            const isRes = item.type === "resource";
            return (
              <div key={item.id} style={{ ...cardStyle, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                {/* Thumbnail or icon */}
                {isRes ? (
                  <div style={{ width: 80, height: 45, borderRadius: 4, background: c.mintSoft, border: `1px solid ${c.mintBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: c.mint }}>{item.format || "PDF"}</span>
                  </div>
                ) : vid ? (
                  <div style={{ width: 80, height: 45, borderRadius: 4, overflow: "hidden", flexShrink: 0, background: "#000" }}>
                    <img src={`https://img.youtube.com/vi/${vid}/default.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ width: 80, height: 45, borderRadius: 4, background: c.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ ...mono, fontSize: 9, color: c.textSoft }}>No video</span>
                  </div>
                )}
                {/* Info */}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                    <span style={{ ...mono, fontSize: 10, color: c.textSoft, textTransform: "uppercase" }}>{item.type}</span>
                    {item.day && <span style={{ ...mono, fontSize: 10, color: c.red }}>Day {item.day}</span>}
                    {isRes && item.format && <span style={{ ...mono, fontSize: 10, color: c.mint }}>{item.format}</span>}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                  <div style={{ ...mono, fontSize: 11, color: c.textSoft }}>{item.speaker}</div>
                </div>
                {/* Actions */}
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <StatusBadge status={item.status} />
                  <button onClick={() => startEdit(item)} style={{ ...btnGhost, fontSize: 11 }}>Edit</button>
                  <button onClick={() => toggleContentStatus(item.id)} style={{ ...btnGhost, fontSize: 11 }}>
                    {item.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => deleteContent(item.id)} style={{ ...btnGhost, fontSize: 11, color: c.red }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  const Events = () => {
    const [form, setForm] = useState({ title: "", date: "", time: "", type: "Workshop", host: "", spots: "", description: "" });
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);

    const resetForm = () => { setForm({ title: "", date: "", time: "", type: "Workshop", host: "", spots: "", description: "" }); setEditing(null); setShowAddEvent(false); };
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

    const saveEvent = async (status) => {
      if (!form.title.trim()) return showToast("Title is required.");
      setSaving(true);
      try {
        const body = { title: form.title, date: form.date || null, time: form.time, type: form.type, host: form.host, spots: form.spots ? parseInt(form.spots) : null, description: form.description, status };
        const method = editing ? "PATCH" : "POST";
        if (editing) body.id = editing;
        const res = await fetch("/api/admin/events", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("Failed");
        const { data } = await res.json();
        if (editing) { setEventItems(items => items.map(i => i.id === editing ? data : i)); }
        else { setEventItems(items => [data, ...items]); }
        resetForm();
        showToast(editing ? "Event updated." : "Event created.");
      } catch (e) { showToast("Error saving. Try again."); }
      setSaving(false);
    };

    const deleteEvent = async (id) => {
      if (!confirm("Delete this event?")) return;
      try {
        await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        setEventItems(items => items.filter(i => i.id !== id));
        showToast("Event deleted.");
      } catch (e) { showToast("Error deleting."); }
    };

    const markCompleted = async (id) => {
      try {
        await fetch("/api/admin/events", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "completed" }) });
        setEventItems(items => items.map(i => i.id === id ? { ...i, status: "completed" } : i));
        showToast("Event marked completed.");
      } catch (e) { showToast("Error updating."); }
    };

    const startEdit = (item) => {
      setForm({ title: item.title, date: item.date || "", time: item.time || "", type: item.type || "Workshop", host: item.host || "", spots: item.spots ? String(item.spots) : "", description: item.description || "" });
      setEditing(item.id);
      setShowAddEvent(true);
    };

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ ...serif, fontSize: 22 }}>Events ({eventItems.length})</h2>
          <button onClick={() => { resetForm(); setShowAddEvent(!showAddEvent); }} style={btnRed}><PlusI s={13} /> Create event</button>
        </div>

        {showAddEvent && (
          <div style={{ ...cardStyle, padding: 22, borderColor: c.redBorder, animation: "fadeIn 0.2s ease" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{editing ? "Edit event" : "New event"}</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div><label style={labelStyle}>Title</label><input style={inputStyle} placeholder="Event title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }} className="fm-form-grid">
                <div><label style={labelStyle}>Date</label><input style={inputStyle} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
                <div><label style={labelStyle}>Time</label><input style={inputStyle} placeholder="6:00 PM WAT" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="Workshop">Workshop</option><option value="Q&A">Q&A</option><option value="Masterclass">Masterclass</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="fm-form-grid">
                <div><label style={labelStyle}>Host</label><input style={inputStyle} placeholder="Who's running this" value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))} /></div>
                <div><label style={labelStyle}>Max spots (empty = unlimited)</label><input style={inputStyle} type="number" placeholder="e.g. 12" value={form.spots} onChange={e => setForm(f => ({ ...f, spots: e.target.value }))} /></div>
              </div>
              <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="What this event covers..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => saveEvent("upcoming")} disabled={saving} style={btnRed}>{saving ? "Saving..." : editing ? "Update" : "Create event"}</button>
                <button onClick={resetForm} style={btnGhost}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          {eventItems.length === 0 && (
            <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}>
              <p style={{ color: c.textMuted, fontSize: 14 }}>No events yet. Create your first one above.</p>
            </div>
          )}
          {eventItems.map(ev => (
            <div key={ev.id} style={{ ...cardStyle, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                  <span style={{ ...mono, fontSize: 10, color: c.textSoft, textTransform: "uppercase" }}>{ev.type}</span>
                  <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{fmtDate(ev.date)}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
                <div style={{ ...mono, fontSize: 11, color: c.textSoft }}>{ev.host}{ev.spots ? ` \u00b7 ${ev.spots} spots` : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <StatusBadge status={ev.status} />
                <button onClick={() => startEdit(ev)} style={{ ...btnGhost, fontSize: 11 }}>Edit</button>
                {ev.status !== "completed" && <button onClick={() => markCompleted(ev.id)} style={{ ...btnGhost, fontSize: 11, color: c.mint }}>Complete</button>}
                <button onClick={() => deleteEvent(ev.id)} style={{ ...btnGhost, fontSize: 11, color: c.red }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  const Announcements = () => {
    const [form, setForm] = useState({ title: "", body: "", pinned: false });
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);

    const resetForm = () => { setForm({ title: "", body: "", pinned: false }); setEditing(null); setShowAddAnnouncement(false); };

    const saveAnnouncement = async (status) => {
      if (!form.title.trim()) return showToast("Title is required.");
      setSaving(true);
      try {
        const body = { title: form.title, body: form.body, pinned: form.pinned, status };
        const method = editing ? "PATCH" : "POST";
        if (editing) body.id = editing;
        const res = await fetch("/api/admin/announcements", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("Failed");
        const { data } = await res.json();
        if (editing) {
          setAnnouncementItems(items => items.map(i => i.id === editing ? data : i));
        } else {
          setAnnouncementItems(items => [data, ...items]);
        }
        resetForm();
        showToast(editing ? "Announcement updated." : "Announcement posted.");
      } catch (e) { showToast("Error saving. Try again."); }
      setSaving(false);
    };

    const deleteAnnouncement = async (id) => {
      if (!confirm("Delete this announcement?")) return;
      try {
        await fetch("/api/admin/announcements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        setAnnouncementItems(items => items.filter(i => i.id !== id));
        showToast("Announcement deleted.");
      } catch (e) { showToast("Error deleting."); }
    };

    const startEdit = (item) => {
      setForm({ title: item.title, body: item.body || "", pinned: item.pinned || false });
      setEditing(item.id);
      setShowAddAnnouncement(true);
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ ...serif, fontSize: 22 }}>Announcements ({announcementItems.length})</h2>
          <button onClick={() => { resetForm(); setShowAddAnnouncement(!showAddAnnouncement); }} style={btnRed}><PlusI s={13} /> Post announcement</button>
        </div>

        {showAddAnnouncement && (
          <div style={{ ...cardStyle, padding: 22, borderColor: c.redBorder, animation: "fadeIn 0.2s ease" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{editing ? "Edit announcement" : "New announcement"}</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div><label style={labelStyle}>Title</label><input style={inputStyle} placeholder="Announcement title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><label style={labelStyle}>Body</label><textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="What you want to say to the community…" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} /></div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: c.textMuted }}>
                <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} style={{ accentColor: c.red }} />
                Pin to top of dashboard
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => saveAnnouncement("published")} disabled={saving} style={btnRed}>{saving ? "Saving…" : editing ? "Update" : "Post"}</button>
                <button onClick={() => saveAnnouncement("draft")} disabled={saving} style={btnOutline}>Save as draft</button>
                <button onClick={resetForm} style={btnGhost}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements list */}
        <div style={{ display: "grid", gap: 10 }}>
          {announcementItems.length === 0 && (
            <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}>
              <p style={{ color: c.textMuted, fontSize: 14 }}>No announcements yet. Post your first one above.</p>
            </div>
          )}
          {announcementItems.map(a => (
            <div key={a.id} style={{
              ...cardStyle, padding: "14px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: 12, flexWrap: "wrap",
              borderLeft: a.pinned ? `3px solid ${c.red}` : undefined,
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                  {a.pinned && <span style={{ color: c.red }}><PinI /></span>}
                  <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{fmtDate(a.created_at)}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                {a.body && <div style={{ fontSize: 12, color: c.textSoft, marginTop: 2 }}>{a.body.length > 80 ? a.body.slice(0, 80) + "…" : a.body}</div>}
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                <StatusBadge status={a.status} />
                <button onClick={() => startEdit(a)} style={{ ...btnGhost, fontSize: 11 }}>Edit</button>
                <button onClick={() => togglePin(a.id)} style={{ ...btnGhost, fontSize: 11, color: a.pinned ? c.red : c.textSoft }}>
                  {a.pinned ? "Unpin" : "Pin"}
                </button>
                <button onClick={() => deleteAnnouncement(a.id)} style={{ ...btnGhost, fontSize: 11, color: c.red }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sectionMap = { overview: <Overview />, members: <Members />, content: <Content />, events: <Events />, announcements: <Announcements /> };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{
      ...sans, background: c.bg, color: c.text, minHeight: "100vh",
      transition: "background 0.35s ease, color 0.35s ease",
      WebkitFontSmoothing: "antialiased",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${c.red}44; }
        :focus-visible { outline: 2px solid ${c.red}; outline-offset: 2px; }
        input:focus-visible, textarea:focus-visible, select:focus-visible { outline: none; border-color: ${c.red} !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        table { font-family: inherit; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px !important; }
        @media (max-width: 860px) {
          .fm-admin-sidebar { display: none !important; }
          .fm-admin-mob-bar { display: flex !important; }
          .fm-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .fm-overview-grid { grid-template-columns: 1fr !important; }
          .fm-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 861px) { .fm-admin-mob-bar { display: none !important; } }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* ═══ SIDEBAR ════════════════════════════════════════ */}
        <aside className="fm-admin-sidebar" style={{
          width: 220, flexShrink: 0, background: c.sidebarBg,
          borderRight: `1px solid ${c.border}`, padding: "20px 12px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 24 }}>
              <div style={{ width: 28, height: 28, borderRadius: 3, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff" }}>F</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Form & Meaning</div>
                <div style={{ ...mono, fontSize: 9, color: c.textSoft }}>Admin panel</div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 2 }}>
              {sidebarLinks.map(link => (
                <button key={link.key} onClick={() => setSection(link.key)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "9px 10px", borderRadius: 5, border: "none",
                  background: section === link.key ? c.redSoft : "transparent",
                  color: section === link.key ? c.red : c.textMuted,
                  fontWeight: section === link.key ? 700 : 500,
                  cursor: "pointer", fontSize: 13, ...sans,
                  transition: "all 0.12s ease",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: section === link.key ? c.red : c.textSoft }}>{link.icon}</span>
                    {link.label}
                  </span>
                  {link.count !== undefined && (
                    <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{link.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: 2, paddingTop: 16, borderTop: `1px solid ${c.border}` }}>
            <button onClick={toggle} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "9px 10px", borderRadius: 5, border: "none",
              background: "transparent", color: c.textSoft, cursor: "pointer",
              fontSize: 13, ...sans,
            }}>
              {dark ? <Sun /> : <Moon />} {dark ? "Light mode" : "Dark mode"}
            </button>
            <button onClick={() => window.location.href="/"} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "9px 10px", borderRadius: 5, border: "none",
              background: "transparent", color: c.textSoft, cursor: "pointer",
              fontSize: 13, ...sans,
            }}>
              <ExtI s={16} /> View site
            </button>
            <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href="/admin/login"; }} style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "9px 10px", borderRadius: 5, border: "none",
              background: "transparent", color: c.red, cursor: "pointer",
              fontSize: 13, ...sans,
            }}>
              <LogoutI /> Log out
            </button>
          </div>
        </aside>

        {/* ═══ MAIN AREA ══════════════════════════════════════ */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Mobile top bar */}
          <div className="fm-admin-mob-bar" style={{
            display: "none", position: "sticky", top: 0, zIndex: 100,
            background: c.navBg, backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${c.border}`,
            padding: "0 16px", height: 56, alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 3, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>F</div>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Admin</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={toggle} style={{ ...btnGhost, padding: 6 }}>{dark ? <Sun /> : <Moon />}</button>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ ...btnGhost, padding: 6 }}>{sidebarOpen ? <XI /> : <MenuI />}</button>
            </div>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div style={{
              position: "fixed", inset: 0, top: 56, zIndex: 99,
              background: c.bg, padding: 16, animation: "fadeIn 0.15s ease",
              display: "grid", gap: 2, alignContent: "start",
            }}>
              {sidebarLinks.map(link => (
                <button key={link.key} onClick={() => { setSection(link.key); setSidebarOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "14px 12px", borderRadius: 5, border: "none",
                  background: section === link.key ? c.redSoft : "transparent",
                  color: section === link.key ? c.red : c.textMuted,
                  fontWeight: section === link.key ? 700 : 500,
                  cursor: "pointer", fontSize: 16, ...sans,
                }}>
                  {link.icon} {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div style={{ padding: "28px 28px 60px", maxWidth: 960, animation: "fadeUp 0.35s ease" }}>
            {sectionMap[section]}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 300,
          padding: "12px 18px", borderRadius: 6,
          background: c.cardBg, border: `1px solid ${c.mintBorder}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          animation: "fadeUp 0.25s ease", fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8, color: c.text,
        }}>
          <span style={{ color: c.mint }}><CheckI /></span> {toast}
        </div>
      )}
    </div>
  );
}
