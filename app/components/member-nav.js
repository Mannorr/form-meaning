"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MemberNav({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/library", label: "Library" },
    { href: "/community", label: "Community" },
    { href: "/events", label: "Events" },
  ];

  const initials = (user?.name || user?.email || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(245,240,235,0.9)", backdropFilter: "blur(20px) saturate(180%)",
      borderBottom: "1px solid rgba(0,0,0,0.08)", fontFamily: "'Syne', sans-serif",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#1A1A1A" }}>
          <div style={{ width: 32, height: 32, borderRadius: 3, background: "#D42B22", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff" }}>F</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Form & Meaning</div>
            <div style={{ fontSize: 10, color: "rgba(26,26,26,0.35)", letterSpacing: "0.03em" }}>Member area</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="fm-desk-nav">
          {links.map(link => (
            <Link key={link.href} href={link.href} style={{
              padding: "8px 12px", borderRadius: 4, fontSize: 13, fontWeight: pathname === link.href ? 700 : 500,
              color: pathname === link.href ? "#D42B22" : "rgba(26,26,26,0.6)",
              textDecoration: "none", transition: "all 0.15s ease",
            }}>{link.label}</Link>
          ))}
          <span style={{ width: 1, height: 20, background: "rgba(0,0,0,0.08)", margin: "0 6px" }} />
          <Link href="/profile" style={{
            width: 32, height: 32, borderRadius: "50%", background: "#D42B22",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff", textDecoration: "none",
            boxShadow: pathname === "/profile" ? "0 0 0 2px #D42B22" : "none",
          }}>{initials}</Link>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="fm-mob-toggle" style={{
          display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, color: "#1A1A1A",
        }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, top: 60, zIndex: 99, background: "#F5F0EB", padding: 24, display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
              padding: "16px 8px", fontSize: 17, color: pathname === link.href ? "#D42B22" : "rgba(26,26,26,0.6)",
              fontWeight: pathname === link.href ? 700 : 500, textDecoration: "none",
            }}>{link.label}</Link>
          ))}
          <div style={{ height: 1, background: "rgba(0,0,0,0.08)", margin: "8px 0" }} />
          <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ padding: "16px 8px", fontSize: 17, textDecoration: "none", color: "rgba(26,26,26,0.6)" }}>Profile</Link>
          <button onClick={handleLogout} style={{ padding: "16px 8px", fontSize: 17, color: "#D42B22", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>Log out</button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .fm-desk-nav { display: none !important; } .fm-mob-toggle { display: flex !important; } }
        @media (min-width: 901px) { .fm-mob-toggle { display: none !important; } }
      `}</style>
    </header>
  );
}
