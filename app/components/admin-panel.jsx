"use client";
import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [theme, setTheme] = useState("light");
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dark = theme === "dark";
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");

  // ─── Data state ────────────────────────────────────────────
  const [members, setMembers] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [eventItems, setEventItems] = useState([]);
  const [announcementItems, setAnnouncementItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── UI state ──────────────────────────────────────────────
  const [memberSearch, setMemberSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");
  const [showAddContent, setShowAddContent] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  // ─── Load all data once on mount (not in render body) ──────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [mRes, cRes, eRes, aRes] = await Promise.all([
          fetch("/api/admin/members"),
          fetch("/api/admin/content"),
          fetch("/api/admin/events"),
          fetch("/api/admin/announcements"),
        ]);
        const [mData, cData, eData, aData] = await Promise.all([
          mRes.json(), cRes.json(), eRes.json(), aRes.json(),
        ]);
        if (mData.data) setMembers(mData.data);
        if (cData.data) setContentItems(cData.data);
        if (eData.data) setEventItems(eData.data);
        if (aData.data) setAnnouncementItems(aData.data);
      } catch (e) {
        showToast("Failed to load data. Refresh the page.");
      }
      setLoading(false);
    };
    load();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  const askConfirm = (message, onConfirm) => setConfirm({ message, onConfirm });

  const filteredMembers = members.filter(m => {
    const matchSearch = !memberSearch.trim() ||
      (m.name || "").toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(memberSearch.toLowerCase());
    const matchFilter = memberFilter === "all" || m.status === memberFilter;
    return matchSearch && matchFilter;
  });

  const toggleMemberStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/members", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) });
      if (!res.ok) throw new Error();
      setMembers(ms => ms.map(m => m.id === id ? { ...m, status: newStatus } : m));
      showToast(`Member ${newStatus === "active" ? "activated" : newStatus === "suspended" ? "suspended" : "updated"}.`);
    } catch { showToast("Error updating member.", "error"); }
  };

  const removeMember = (id) => {
    askConfirm("Remove this member? This cannot be undone.", async () => {
      try {
        await fetch("/api/admin/members", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        setMembers(ms => ms.filter(m => m.id !== id));
        showToast("Member removed.");
      } catch { showToast("Error removing member.", "error"); }
    });
  };

  const toggleContentStatus = async (id) => {
    const item = contentItems.find(i => i.id === id);
    if (!item) return;
    const newStatus = item.status === "published" ? "draft" : "published";
    try {
      await fetch("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) });
      setContentItems(items => items.map(i => i.id === id ? { ...i, status: newStatus } : i));
      showToast("Content updated.");
    } catch { showToast("Error updating.", "error"); }
  };

  const togglePin = async (id) => {
    const item = announcementItems.find(i => i.id === id);
    if (!item) return;
    try {
      await fetch("/api/admin/announcements", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, pinned: !item.pinned }) });
      setAnnouncementItems(items => items.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i));
      showToast("Announcement updated.");
    } catch { showToast("Error updating.", "error"); }
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
    navBg: "rgba(17,17,17,0.95)", cardBg: "#1A1A1A", inputBg: "#1A1A1A", sidebarBg: "#151515",
  } : {
    bg: "#F5F0EB", bg2: "#EDE8E1", bg3: "#E5DFD8",
    surface: "rgba(0,0,0,0.03)", surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", mintSoft: "rgba(29,184,142,0.08)", mintBorder: "rgba(29,184,142,0.2)",
    amber: "#B8922A", amberSoft: "rgba(184,146,42,0.08)", amberBorder: "rgba(184,146,42,0.2)",
    navBg: "rgba(245,240,235,0.95)", cardBg: "#FFFFFF", inputBg: "#FFFFFF", sidebarBg: "#FFFEFA",
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
  const AlertI = ({ s = 18 }) => <Ico size={s} d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />;

  // ─── Status badge ──────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const map = {
      active:    { bg: c.mintSoft,  color: c.mint,  border: c.mintBorder },
      suspended: { bg: c.amberSoft, color: c.amber, border: c.amberBorder },
      pending:   { bg: c.redSoft,   color: c.red,   border: c.redBorder },
      published: { bg: c.mintSoft,  color: c.mint,  border: c.mintBorder },
      draft:     { bg: c.surface,   color: c.textSoft, border: c.border },
      upcoming:  { bg: c.mintSoft,  color: c.mint,  border: c.mintBorder },
      completed: { bg: c.surface,   color: c.textSoft, border: c.border },
    };
    const s = map[status] || map.draft;
    return (
      <span style={{ ...mono, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.04em", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{status}</span>
    );
  };

  // ─── Loading skeleton ──────────────────────────────────────
  const Skeleton = ({ rows = 4 }) => (
    <div style={{ display: "grid", gap: 10 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ ...cardStyle, padding: "14px 18px", display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 6, background: c.surface, flexShrink: 0, animation: "pulse 1.4s ease infinite" }} />
          <div style={{ flex: 1, display: "grid", gap: 8 }}>
            <div style={{ height: 12, borderRadius: 3, background: c.surface, width: "55%", animation: "pulse 1.4s ease infinite" }} />
            <div style={{ height: 10, borderRadius: 3, background: c.surface, width: "35%", animation: "pulse 1.4s ease 0.1s infinite" }} />
          </div>
        </div>
      ))}
    </div>
  );

  // ─── Sidebar nav ───────────────────────────────────────────
  const sidebarLinks = [
    { key: "overview",      label: "Overview",      icon: <GridI /> },
    { key: "members",       label: "Members",       icon: <UsersI />, count: members.length },
    { key: "content",       label: "Content",       icon: <BookI />,  count: contentItems.length },
    { key: "events",        label: "Events",        icon: <CalI />,   count: eventItems.length },
    { key: "announcements", label: "Announcements", icon: <MegaI />,  count: announcementItems.length },
  ];

  const stats = [
    { label: "Active members",   value: members.filter(m => m.status === "active").length,    color: c.mint },
    { label: "Pending",          value: members.filter(m => m.status === "pending").length,   color: c.amber },
    { label: "Published content",value: contentItems.filter(i => i.status === "published").length, color: c.red },
    { label: "Upcoming events",  value: eventItems.filter(e => e.status === "upcoming").length, color: c.mint },
  ];

  // ═══════════════════════════════════════════════════════════
  // SECTIONS
  // ═══════════════════════════════════════════════════════════

  const Overview = () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <h2 style={{ ...serif, fontSize: 26, marginBottom: 4 }}>Admin Dashboard</h2>
        <p style={{ color: c.textMuted, fontSize: 13 }}>Manage your community, content, and events.</p>
      </div>
      {loading ? <Skeleton rows={1} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="fm-stat-grid">
          {stats.map((s, i) => (
            <div key={i} style={{ ...cardStyle, padding: 20 }}>
              <div style={{ ...serif, fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ ...mono, fontSize: 10, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="fm-overview-grid">
        <div style={{ ...cardStyle, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Recent members</h3>
          {loading ? <Skeleton rows={3} /> : (
            <div style={{ display: "grid", gap: 10 }}>
              {members.slice(0, 4).map(m => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name || m.email?.split("@")[0]}</div>
                    <div style={{ ...mono, fontSize: 10, color: c.textSoft }}>{m.email}</div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ ...cardStyle, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Upcoming events</h3>
          {loading ? <Skeleton rows={3} /> : eventItems.filter(e => e.status === "upcoming").length === 0 ? (
            <p style={{ color: c.textMuted, fontSize: 13 }}>No upcoming events.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {eventItems.filter(e => e.status === "upcoming").map(e => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                    <div style={{ ...mono, fontSize: 10, color: c.textSoft }}>{e.event_date ? new Date(e.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"} · {e.rsvp_count ?? 0} RSVPs</div>
                  </div>
                  <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{e.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ ...cardStyle, padding: 22 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Quick actions</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setSection("members")} style={btnOutline}><UsersI /> Manage members</button>
          <button onClick={() => { setSection("content"); setShowAddContent(true); }} style={btnOutline}><PlusI /> Add content</button>
          <button onClick={() => { setSection("events"); setShowAddEvent(true); }} style={btnOutline}><PlusI /> Create event</button>
          <button onClick={() => { setSection("announcements"); setShowAddAnnouncement(true); }} style={btnOutline}><PlusI /> Post announcement</button>
          <button onClick={() => window.location.href = "/"} style={btnOutline}><ExtI /> View site</button>
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
      if (!newEmail.trim()) return showToast("Email is required.", "error");
      setAddBusy(true);
      try {
        const res = await fetch("/api/admin/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newEmail.trim().toLowerCase(), name: newName.trim(), status: "active", paid: true, admin_approved: true }) });
        if (!res.ok) { const j = await res.json(); showToast(j.error || "Failed to add.", "error"); setAddBusy(false); return; }
        const { data } = await res.json();
        await fetch("/api/admin/setup-passwords-single", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newEmail.trim().toLowerCase() }) }).catch(() => {});
        setMembers(ms => [data, ...ms]);
        setNewEmail(""); setNewName(""); setAddMode(false);
        showToast("Member added.");
      } catch { showToast("Error adding member.", "error"); }
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
              <p style={{ ...mono, fontSize: 11, color: c.textSoft }}>Default password: formmeaning1! — member can change it after first login.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addMember} disabled={addBusy} style={btnRed}>{addBusy ? "Adding…" : "Add member"}</button>
                <button onClick={() => setAddMode(false)} style={btnGhost}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: c.textSoft }}><SearchI /></span>
            <input type="text" placeholder="Search name or email…" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>
          <div style={{ display: "flex", gap: 3, border: `1px solid ${c.border}`, borderRadius: 4, overflow: "hidden" }}>
            {["all", "active", "pending", "suspended"].map(f => (
              <button key={f} onClick={() => setMemberFilter(f)} style={{ ...btnGhost, borderRadius: 0, fontSize: 11, padding: "7px 12px", background: memberFilter === f ? c.redSoft : "transparent", color: memberFilter === f ? c.red : c.textSoft, fontWeight: memberFilter === f ? 700 : 500, ...mono, textTransform: "capitalize", border: "none" }}>{f}</button>
            ))}
          </div>
        </div>

        {loading ? <Skeleton rows={5} /> : (
          <div style={{ ...cardStyle, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                    {["Name", "Email", "Discipline", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} style={{ ...mono, fontSize: 10, fontWeight: 600, color: c.textSoft, textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px", textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map(m => (
                    <tr key={m.id} style={{ borderBottom: `1px solid ${c.border}` }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{m.name || m.email?.split("@")[0] || "Member"}</td>
                      <td style={{ padding: "12px 16px", color: c.textMuted, ...mono, fontSize: 11 }}>{m.email}</td>
                      <td style={{ padding: "12px 16px", color: c.textMuted }}>{m.discipline || "—"}</td>
                      <td style={{ padding: "12px 16px" }}><StatusBadge status={m.status} /></td>
                      <td style={{ padding: "12px 16px", ...mono, fontSize: 11, color: c.textSoft }}>{m.created_at ? new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {m.status === "pending"   && <button onClick={() => toggleMemberStatus(m.id, "active")}    style={{ ...btnMint,  padding: "5px 10px", fontSize: 11 }}>Approve</button>}
                          {m.status === "active"    && <button onClick={() => toggleMemberStatus(m.id, "suspended")} style={{ ...btnGhost, fontSize: 11, color: c.amber }}>Suspend</button>}
                          {m.status === "suspended" && <button onClick={() => toggleMemberStatus(m.id, "active")}    style={{ ...btnGhost, fontSize: 11, color: c.mint }}>Reactivate</button>}
                          <button onClick={() => removeMember(m.id)} style={{ ...btnGhost, fontSize: 11, color: c.red, padding: "5px 8px" }}><TrashI /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Content = () => {
    const [form, setForm] = useState({ title: "", speaker: "", type: "conference", day: "", video_url: "", file_url: "", format: "PDF", thumbnail_url: "", description: "" });
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);

    const getYtId = (url) => { const m = (url || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/); return m ? m[1] : null; };
    const ytThumb = getYtId(form.video_url);
    const isResource = form.type === "resource";

    const resetForm = () => { setForm({ title: "", speaker: "", type: "conference", day: "", video_url: "", file_url: "", format: "PDF", thumbnail_url: "", description: "" }); setEditing(null); setShowAddContent(false); };

    const saveContent = async (status) => {
      if (!form.title.trim()) return showToast("Title is required.", "error");
      setSaving(true);
      try {
        const body = { title: form.title, speaker: form.speaker, type: form.type, video_url: form.video_url, file_url: form.file_url, format: form.format, thumbnail_url: form.thumbnail_url, description: form.description, status, day: form.day ? parseInt(form.day) : null };
        const method = editing ? "PATCH" : "POST";
        if (editing) body.id = editing;
        const res = await fetch("/api/admin/content", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("Failed");
        const { data } = await res.json();
        if (editing) { setContentItems(items => items.map(i => i.id === editing ? data : i)); }
        else { setContentItems(items => [data, ...items]); }
        resetForm();
        showToast(editing ? "Content updated." : "Content added.");
      } catch { showToast("Error saving. Try again.", "error"); }
      setSaving(false);
    };

    const deleteContent = (id) => {
      askConfirm("Delete this content item?", async () => {
        try {
          await fetch("/api/admin/content", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
          setContentItems(items => items.filter(i => i.id !== id));
          showToast("Content deleted.");
        } catch { showToast("Error deleting.", "error"); }
      });
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
              <div><label style={labelStyle}>Content type</label><select style={{ ...inputStyle, cursor: "pointer" }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option value="conference">Conference Video</option><option value="recording">Recording</option><option value="resource">Resource / PDF</option></select></div>
              {!isResource && <div><label style={labelStyle}>YouTube URL</label><input style={inputStyle} placeholder="https://www.youtube.com/watch?v=…" value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} /></div>}
              {!isResource && ytThumb && (
                <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${c.border}`, maxWidth: 400 }}>
                  <img src={`https://img.youtube.com/vi/${ytThumb}/hqdefault.jpg`} alt="YouTube thumbnail" style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }} />
                  <div style={{ padding: "8px 12px", background: c.surface, ...mono, fontSize: 11, color: c.mint }}>✓ Thumbnail detected</div>
                </div>
              )}
              {isResource && (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }} className="fm-form-grid">
                  <div><label style={labelStyle}>File URL</label><input style={inputStyle} placeholder="https://drive.google.com/file/d/…" value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} /></div>
                  <div><label style={labelStyle}>Format</label><select style={{ ...inputStyle, cursor: "pointer" }} value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}><option value="PDF">PDF</option><option value="DOC">DOC</option><option value="Slides">Slides</option><option value="Notion">Notion</option><option value="Link">Link</option></select></div>
                </div>
              )}
              {isResource && <div><label style={labelStyle}>Thumbnail URL (optional)</label><input style={inputStyle} placeholder="https://…/thumbnail.jpg" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} /></div>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="fm-form-grid">
                <div><label style={labelStyle}>Title</label><input style={inputStyle} placeholder="e.g. The Problem You Were Hired to Solve" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div><label style={labelStyle}>{isResource ? "Author" : "Speaker"}</label><input style={inputStyle} placeholder="e.g. Mannorr" value={form.speaker} onChange={e => setForm(f => ({ ...f, speaker: e.target.value }))} /></div>
              </div>
              {!isResource && <div><label style={labelStyle}>Day (conference only)</label><input style={inputStyle} type="number" placeholder="1, 2, 3…" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} /></div>}
              <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="What this covers…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => saveContent("published")} disabled={saving} style={btnRed}>{saving ? "Saving…" : editing ? "Update & Publish" : "Publish"}</button>
                <button onClick={() => saveContent("draft")} disabled={saving} style={btnOutline}>{editing ? "Update as Draft" : "Save draft"}</button>
                <button onClick={resetForm} style={btnGhost}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? <Skeleton rows={4} /> : (
          <div style={{ display: "grid", gap: 10 }}>
            {contentItems.length === 0 && <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}><p style={{ color: c.textMuted, fontSize: 14 }}>No content yet. Add your first video or resource above.</p></div>}
            {contentItems.map(item => {
              const vid = ((item.video_url || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/) || [])[1];
              const isRes = item.type === "resource";
              return (
                <div key={item.id} style={{ ...cardStyle, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
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
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                      <span style={{ ...mono, fontSize: 10, color: c.textSoft, textTransform: "uppercase" }}>{item.type}</span>
                      {item.day && <span style={{ ...mono, fontSize: 10, color: c.red }}>Day {item.day}</span>}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                    <div style={{ ...mono, fontSize: 11, color: c.textSoft }}>{item.speaker}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <StatusBadge status={item.status} />
                    <button onClick={() => startEdit(item)} style={{ ...btnGhost, fontSize: 11 }}>Edit</button>
                    <button onClick={() => toggleContentStatus(item.id)} style={{ ...btnGhost, fontSize: 11 }}>{item.status === "published" ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => deleteContent(item.id)} style={{ ...btnGhost, fontSize: 11, color: c.red }}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const Events = () => {
    const [form, setForm] = useState({ title: "", event_date: "", time: "", type: "Workshop", host: "", spots: "", description: "" });
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);

    const resetForm = () => { setForm({ title: "", event_date: "", time: "", type: "Workshop", host: "", spots: "", description: "" }); setEditing(null); setShowAddEvent(false); };
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

    const saveEvent = async (status) => {
      if (!form.title.trim()) return showToast("Title is required.", "error");
      if (!form.event_date) return showToast("Date is required.", "error");
      setSaving(true);
      try {
        const body = { title: form.title, event_date: form.event_date || null, time: form.time, type: form.type, host: form.host, spots: form.spots ? parseInt(form.spots) : null, description: form.description, status };
        const method = editing ? "PATCH" : "POST";
        if (editing) body.id = editing;
        const res = await fetch("/api/admin/events", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("Failed");
        const { data } = await res.json();
        if (editing) { setEventItems(items => items.map(i => i.id === editing ? data : i)); }
        else { setEventItems(items => [data, ...items]); }
        resetForm();
        showToast(editing ? "Event updated." : "Event created.");
      } catch { showToast("Error saving. Try again.", "error"); }
      setSaving(false);
    };

    const deleteEvent = (id) => {
      askConfirm("Delete this event?", async () => {
        try {
          await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
          setEventItems(items => items.filter(i => i.id !== id));
          showToast("Event deleted.");
        } catch { showToast("Error deleting.", "error"); }
      });
    };

    const markCompleted = async (id) => {
      try {
        await fetch("/api/admin/events", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "completed" }) });
        setEventItems(items => items.map(i => i.id === id ? { ...i, status: "completed" } : i));
        showToast("Event marked completed.");
      } catch { showToast("Error updating.", "error"); }
    };

    const startEdit = (item) => {
      setForm({ title: item.title, event_date: item.event_date ? item.event_date.slice(0, 10) : "", time: item.time || "", type: item.type || "Workshop", host: item.host || "", spots: item.spots ? String(item.spots) : "", description: item.description || "" });
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
                <div><label style={labelStyle}>Date</label><input style={inputStyle} type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} /></div>
                <div><label style={labelStyle}>Time</label><input style={inputStyle} placeholder="6:00 PM WAT" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
                <div><label style={labelStyle}>Type</label><select style={{ ...inputStyle, cursor: "pointer" }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option value="Workshop">Workshop</option><option value="Q&A">Q&A</option><option value="Masterclass">Masterclass</option><option value="Conference">Conference</option></select></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="fm-form-grid">
                <div><label style={labelStyle}>Host</label><input style={inputStyle} placeholder="Who's running this" value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))} /></div>
                <div><label style={labelStyle}>Max spots (empty = unlimited)</label><input style={inputStyle} type="number" placeholder="e.g. 12" value={form.spots} onChange={e => setForm(f => ({ ...f, spots: e.target.value }))} /></div>
              </div>
              <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="What this event covers…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => saveEvent("upcoming")} disabled={saving} style={btnRed}>{saving ? "Saving…" : editing ? "Update" : "Create event"}</button>
                <button onClick={resetForm} style={btnGhost}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? <Skeleton rows={3} /> : (
          <div style={{ display: "grid", gap: 10 }}>
            {eventItems.length === 0 && <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}><p style={{ color: c.textMuted, fontSize: 14 }}>No events yet. Create your first one above.</p></div>}
            {eventItems.map(ev => (
              <div key={ev.id} style={{ ...cardStyle, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                    <span style={{ ...mono, fontSize: 10, color: c.textSoft, textTransform: "uppercase" }}>{ev.type}</span>
                    <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{fmtDate(ev.event_date)}</span>
                    <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{ev.rsvp_count ?? 0} RSVPs</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
                  <div style={{ ...mono, fontSize: 11, color: c.textSoft }}>{ev.host}{ev.spots ? ` · ${ev.spots} spots` : ""}</div>
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
        )}
      </div>
    );
  };

  const Announcements = () => {
    const [form, setForm] = useState({ title: "", body: "", pinned: false });
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);

    const resetForm = () => { setForm({ title: "", body: "", pinned: false }); setEditing(null); setShowAddAnnouncement(false); };
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

    const saveAnnouncement = async (status) => {
      if (!form.title.trim()) return showToast("Title is required.", "error");
      setSaving(true);
      try {
        const body = { title: form.title, body: form.body, pinned: form.pinned, status };
        const method = editing ? "PATCH" : "POST";
        if (editing) body.id = editing;
        const res = await fetch("/api/admin/announcements", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("Failed");
        const { data } = await res.json();
        if (editing) { setAnnouncementItems(items => items.map(i => i.id === editing ? data : i)); }
        else { setAnnouncementItems(items => [data, ...items]); }
        resetForm();
        showToast(editing ? "Announcement updated." : "Announcement posted.");
      } catch { showToast("Error saving. Try again.", "error"); }
      setSaving(false);
    };

    const deleteAnnouncement = (id) => {
      askConfirm("Delete this announcement?", async () => {
        try {
          await fetch("/api/admin/announcements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
          setAnnouncementItems(items => items.filter(i => i.id !== id));
          showToast("Announcement deleted.");
        } catch { showToast("Error deleting.", "error"); }
      });
    };

    const startEdit = (item) => { setForm({ title: item.title, body: item.body || "", pinned: item.pinned || false }); setEditing(item.id); setShowAddAnnouncement(true); };

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

        {loading ? <Skeleton rows={3} /> : (
          <div style={{ display: "grid", gap: 10 }}>
            {announcementItems.length === 0 && <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}><p style={{ color: c.textMuted, fontSize: 14 }}>No announcements yet.</p></div>}
            {announcementItems.map(a => (
              <div key={a.id} style={{ ...cardStyle, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderLeft: a.pinned ? `3px solid ${c.red}` : undefined }}>
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
                  <button onClick={() => togglePin(a.id)} style={{ ...btnGhost, fontSize: 11, color: a.pinned ? c.red : c.textSoft }}>{a.pinned ? "Unpin" : "Pin"}</button>
                  <button onClick={() => deleteAnnouncement(a.id)} style={{ ...btnGhost, fontSize: 11, color: c.red }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sectionMap = { overview: <Overview />, members: <Members />, content: <Content />, events: <Events />, announcements: <Announcements /> };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{ ...sans, background: c.bg, color: c.text, minHeight: "100vh", transition: "background 0.35s ease, color 0.35s ease", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${c.red}44; }
        :focus-visible { outline: 2px solid ${c.red}; outline-offset: 2px; }
        input:focus-visible, textarea:focus-visible, select:focus-visible { outline: none; border-color: ${c.red} !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
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
        <aside className="fm-admin-sidebar" style={{ width: 220, flexShrink: 0, background: c.sidebarBg, borderRight: `1px solid ${c.border}`, padding: "20px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
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
                <button key={link.key} onClick={() => setSection(link.key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 10px", borderRadius: 5, border: "none", background: section === link.key ? c.redSoft : "transparent", color: section === link.key ? c.red : c.textMuted, fontWeight: section === link.key ? 700 : 500, cursor: "pointer", fontSize: 13, ...sans, transition: "all 0.12s ease" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: section === link.key ? c.red : c.textSoft }}>{link.icon}</span>
                    {link.label}
                  </span>
                  {link.count !== undefined && <span style={{ ...mono, fontSize: 10, color: c.textSoft }}>{link.count}</span>}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: 2, paddingTop: 16, borderTop: `1px solid ${c.border}` }}>
            <button onClick={toggle} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 10px", borderRadius: 5, border: "none", background: "transparent", color: c.textSoft, cursor: "pointer", fontSize: 13, ...sans }}>{dark ? <Sun /> : <Moon />} {dark ? "Light mode" : "Dark mode"}</button>
            <button onClick={() => window.location.href = "/"} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 10px", borderRadius: 5, border: "none", background: "transparent", color: c.textSoft, cursor: "pointer", fontSize: 13, ...sans }}><ExtI s={16} /> View site</button>
            <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 10px", borderRadius: 5, border: "none", background: "transparent", color: c.red, cursor: "pointer", fontSize: 13, ...sans }}><LogoutI /> Log out</button>
          </div>
        </aside>

        {/* ═══ MAIN AREA ══════════════════════════════════════ */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Mobile top bar */}
          <div className="fm-admin-mob-bar" style={{ display: "none", position: "sticky", top: 0, zIndex: 100, background: c.navBg, backdropFilter: "blur(16px)", borderBottom: `1px solid ${c.border}`, padding: "0 16px", height: 56, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 3, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>F</div>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Admin</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={toggle} style={{ ...btnGhost, padding: 6 }}>{dark ? <Sun /> : <Moon />}</button>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ ...btnGhost, padding: 6 }}>{sidebarOpen ? <XI /> : <MenuI />}</button>
            </div>
          </div>

          {/* Mobile sidebar overlay — with backdrop */}
          {sidebarOpen && (
            <>
              <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, top: 56, zIndex: 98, background: "rgba(0,0,0,0.45)", animation: "fadeIn 0.15s ease" }} />
              <div style={{ position: "fixed", inset: 0, top: 56, right: "auto", zIndex: 99, width: 260, background: c.bg, padding: 16, animation: "fadeIn 0.15s ease", display: "grid", gap: 2, alignContent: "start", borderRight: `1px solid ${c.border}` }}>
                {sidebarLinks.map(link => (
                  <button key={link.key} onClick={() => { setSection(link.key); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "14px 12px", borderRadius: 5, border: "none", background: section === link.key ? c.redSoft : "transparent", color: section === link.key ? c.red : c.textMuted, fontWeight: section === link.key ? 700 : 500, cursor: "pointer", fontSize: 16, ...sans }}>
                    {link.icon} {link.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Content */}
          <div style={{ padding: "28px 28px 60px", maxWidth: 960, animation: "fadeUp 0.35s ease" }}>
            {sectionMap[section]}
          </div>
        </div>
      </div>

      {/* ═══ INLINE CONFIRM DIALOG ══════════════════════════ */}
      {confirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", animation: "fadeIn 0.15s ease" }}>
          <div style={{ ...cardStyle, padding: 28, maxWidth: 360, width: "90%", animation: "fadeUp 0.2s ease" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
              <span style={{ color: c.red, flexShrink: 0, marginTop: 2 }}><AlertI /></span>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: c.text }}>{confirm.message}</p>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirm(null)} style={btnOutline}>Cancel</button>
              <button onClick={() => { confirm.onConfirm(); setConfirm(null); }} style={btnRed}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOAST ══════════════════════════════════════════ */}
      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 300, padding: "12px 18px", borderRadius: 6, background: c.cardBg, border: `1px solid ${toast.type === "error" ? c.redBorder : c.mintBorder}`, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", animation: "fadeUp 0.25s ease", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, color: c.text }}>
          <span style={{ color: toast.type === "error" ? c.red : c.mint }}>
            {toast.type === "error" ? <AlertI s={14} /> : <CheckI />}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
