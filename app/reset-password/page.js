"use client";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    if (!password.trim() || password.length < 6) { setMessage("Password must be at least 6 characters."); return; }
    setBusy(true);
    const res = await fetch("/api/auth/update-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const json = await res.json();
    if (!res.ok) { setMessage(json.error || "Failed."); setBusy(false); return; }
    setMessage("Password updated. Redirecting...");
    setTimeout(() => window.location.href = "/dashboard", 1500);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F0EB", fontFamily: "'Syne', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 8, padding: 32, border: "1px solid rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 4 }}>Set new password</h2>
        <p style={{ color: "rgba(26,26,26,0.6)", fontSize: 14, marginBottom: 20 }}>Enter your new password below.</p>
        <form onSubmit={handleReset} style={{ display: "grid", gap: 12 }}>
          <input type="password" placeholder="New password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: "12px 14px", borderRadius: 4, border: "1.5px solid rgba(0,0,0,0.14)", fontSize: 14, outline: "none", width: "100%" }} />
          <button type="submit" disabled={busy} style={{ padding: "12px 20px", background: "#D42B22", color: "#fff", border: "none", borderRadius: 4, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
            {busy ? "Updating..." : "Update password"}
          </button>
        </form>
        {message && <p style={{ marginTop: 12, fontSize: 13, color: message.includes("updated") ? "#1DB88E" : "#D42B22" }}>{message}</p>}
      </div>
    </div>
  );
}
