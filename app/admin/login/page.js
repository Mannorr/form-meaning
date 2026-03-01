"use client";
import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!res.ok) { setError("Invalid password."); setBusy(false); return; }
    window.location.href = "/admin";
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111", fontFamily: "'Syne', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 380, width: "100%", background: "#1A1A1A", borderRadius: 8, padding: 32, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 4, background: "#E63228", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 20 }}>F</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#F5F0EB", marginBottom: 4 }}>Admin access</h2>
        <p style={{ color: "rgba(245,240,235,0.5)", fontSize: 13, marginBottom: 20 }}>Enter the admin password to continue.</p>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <input type="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} style={{ padding: "12px 14px", borderRadius: 4, border: "1.5px solid rgba(255,255,255,0.14)", background: "#222", color: "#F5F0EB", fontSize: 14, outline: "none" }} />
          {error && <p style={{ color: "#E63228", fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ padding: "12px 20px", background: "#E63228", color: "#fff", border: "none", borderRadius: 4, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
            {busy ? "Checking..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
