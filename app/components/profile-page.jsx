"use client";
import { useState } from "react";

export default function ProfilePage({ user }) {
  const [name, setName] = useState(user?.name || "");
  const [discipline, setDiscipline] = useState(user?.discipline || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [portfolio, setPortfolio] = useState(user?.portfolio || "");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const [pwMode, setPwMode] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  async function handleSave() {
    setBusy(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, discipline, bio, portfolio }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2200); }
    } catch (e) { console.error(e); }
    setBusy(false);
  }

  async function handlePwChange() {
    if (!newPw.trim() || newPw.length < 6) { setPwMsg("New password must be at least 6 characters."); return; }
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPw }),
    });
    if (res.ok) { setPwMsg("Password updated."); setNewPw(""); setOldPw(""); }
    else { const j = await res.json(); setPwMsg(j.error || "Failed."); }
  }

  async function handleLogout() {
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const initials = (user?.name || user?.email || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const c = {
    bg: "#F5F0EB", text: "#1A1A1A", textMuted: "rgba(26,26,26,0.6)", textSoft: "rgba(26,26,26,0.35)",
    red: "#D42B22", redSoft: "rgba(212,43,34,0.08)", redBorder: "rgba(212,43,34,0.2)",
    mint: "#1DB88E", border: "rgba(0,0,0,0.08)", borderStrong: "rgba(0,0,0,0.14)",
    cardBg: "#FFFFFF", inputBg: "#FFFFFF",
  };
  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const sans = { fontFamily: "'Syne', 'Helvetica Neue', sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const inputStyle = { width: "100%", padding: "13px 16px", borderRadius: 4, border: `1.5px solid ${c.borderStrong}`, background: c.inputBg, color: c.text, fontSize: 14, ...sans, outline: "none" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: c.textSoft, ...mono, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" };
  const cardStyle = { background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 8 };

  return (
    <div style={{ ...sans, background: c.bg, color: c.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus-visible, textarea:focus-visible { outline: none; border-color: #D42B22 !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .au { animation: fadeUp 0.5s ease both; }
        .au1 { animation: fadeUp 0.5s ease 0.06s both; }
        .au2 { animation: fadeUp 0.5s ease 0.12s both; }
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "36px 24px 80px" }}>
        <div className="au" style={{ marginBottom: 28 }}>
          <h1 style={{ ...serif, fontSize: 32, lineHeight: 1.1 }}>Your profile</h1>
          <p style={{ color: c.textMuted, fontSize: 14, marginTop: 4 }}>
            This is how other members see you in the community directory.
          </p>
        </div>

        {/* Profile Card */}
        <div className="au1" style={{ ...cardStyle, padding: 32, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${c.border}` }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff", ...sans }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, ...serif }}>{user?.name || "Member"}</div>
              <div style={{ ...mono, fontSize: 12, color: c.textSoft, marginTop: 2 }}>{user?.email}</div>
              {user?.created_at && (
                <div style={{ ...mono, fontSize: 10, color: c.textSoft, marginTop: 6 }}>
                  Member since {new Date(user.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div>
              <label style={labelStyle}>Display name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Discipline</label>
              <input type="text" value={discipline} onChange={e => setDiscipline(e.target.value)} placeholder="e.g. Brand Design, UI/UX, Motion…" style={inputStyle} />
              <p style={{ ...mono, fontSize: 10, color: c.textSoft, marginTop: 5 }}>This appears as your tag in the member directory</p>
            </div>
            <div>
              <label style={labelStyle}>Bio</label>
              <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="A short line about you and your work…" style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.6 }} />
              <p style={{ ...mono, fontSize: 10, color: c.textSoft, marginTop: 5 }}>{bio.length}/200 characters</p>
            </div>
            <div>
              <label style={labelStyle}>Portfolio link</label>
              <input type="url" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://your-portfolio.com" style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              <button onClick={handleSave} disabled={busy} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 4, fontSize: 13, fontWeight: 600,
                cursor: "pointer", border: "none", ...sans,
                background: saved ? c.mint : c.red, color: "#fff",
                transition: "all 0.25s ease",
              }}>
                {saved ? "✓ Saved" : busy ? "Saving..." : "Save profile"}
              </button>
              <a href="/community" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 4, fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${c.borderStrong}`, background: "transparent",
                color: c.text, textDecoration: "none", ...sans,
              }}>View directory</a>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="au2" style={{ ...cardStyle, padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: pwMode ? 18 : 0 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Password</h3>
              {!pwMode && <p style={{ fontSize: 13, color: c.textSoft, marginTop: 2 }}>Change your account password</p>}
            </div>
            <button onClick={() => { setPwMode(!pwMode); setPwMsg(""); }} style={{
              padding: "8px 12px", borderRadius: 4, fontSize: 12, fontWeight: 600,
              background: "transparent", border: "none", cursor: "pointer",
              color: pwMode ? c.textSoft : c.red, ...sans,
            }}>{pwMode ? "Cancel" : "Change"}</button>
          </div>
          {pwMode && (
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={labelStyle}>New password</label>
                <input type="password" value={newPw} onChange={e => { setNewPw(e.target.value); setPwMsg(""); }} placeholder="At least 6 characters" style={inputStyle} autoComplete="new-password" />
              </div>
              {pwMsg && (
                <div style={{
                  padding: "10px 14px", borderRadius: 4, fontSize: 13, fontWeight: 500,
                  background: pwMsg.includes("updated") ? "rgba(29,184,142,0.08)" : c.redSoft,
                  border: `1px solid ${pwMsg.includes("updated") ? "rgba(29,184,142,0.2)" : c.redBorder}`,
                  color: pwMsg.includes("updated") ? c.mint : c.red,
                }}>{pwMsg}</div>
              )}
              <button onClick={handlePwChange} style={{
                padding: "10px 18px", borderRadius: 4, fontSize: 13, fontWeight: 600,
                background: c.red, color: "#fff", border: "none", cursor: "pointer",
                alignSelf: "flex-start", ...sans,
              }}>Update password</button>
            </div>
          )}
        </div>

        {/* Log out */}
        <div style={{ ...cardStyle, padding: 24, borderLeft: `3px solid ${c.red}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Log out</h3>
              <p style={{ fontSize: 13, color: c.textSoft, marginTop: 2 }}>Sign out of your account on this device.</p>
            </div>
            <button onClick={handleLogout} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 4, fontSize: 12, fontWeight: 600,
              background: "transparent", border: `1.5px solid ${c.redBorder}`,
              color: c.red, cursor: "pointer", ...sans,
            }}>Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
