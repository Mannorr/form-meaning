import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Resend } from "resend";

const ADMIN_EMAIL = "ag.oluwanifemi@gmail.com";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } } }
  );

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Notify admin
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to: ADMIN_EMAIL,
      subject: `New signup: ${email}`,
      html: `<div style="font-family:sans-serif;line-height:1.7;max-width:520px;"><h2>New account created</h2><p><strong>Email:</strong> ${email}</p><p><strong>Time:</strong> ${new Date().toLocaleString("en-GB",{timeZone:"Africa/Lagos"})}</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Open admin dashboard</a></p></div>`,
    });
  } catch (e) { console.error("Failed to send admin notification:", e); }

  return NextResponse.json({ ok: true });
}
