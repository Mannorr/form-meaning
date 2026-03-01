import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const cleanEmail = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

    const insertData = { email: cleanEmail };
    if (name) insertData.name = name;
    const { error } = await supabaseAdmin.from("subscribers").upsert(insertData, { onConflict: "email" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to: cleanEmail,
      subject: "Welcome to Form & Meaning",
      html: `<div style="font-family:sans-serif;line-height:1.6;"><h2>Welcome.</h2><p>${name ? `Hi ${name}, you` : "You"} just joined a room for designers who want depth, discipline, and responsibility.</p><p>Expect reflections, resources, and invitations to community sessions.</p><p style="color:#666;font-size:13px;">Form & Meaning</p></div>`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e?.message || "Something went wrong." }, { status: 500 }); }
}
