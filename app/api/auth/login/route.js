import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } } }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: "Incorrect email or password. Try again or reset your password." }, { status: 401 });
  if (!data?.session) return NextResponse.json({ error: "No session returned." }, { status: 401 });

  // Self-healing: link user_id to membership row if not already linked.
  // This fixes any member whose user_id was never set (e.g. bulk imports).
  try {
    const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
    await supabaseAdmin
      .from("memberships")
      .update({ user_id: data.user.id })
      .eq("email", email.trim().toLowerCase())
      .is("user_id", null); // only update if still null — avoids unnecessary writes
  } catch (e) {
    console.error("user_id link failed:", e.message);
    // Non-fatal — login still succeeds
  }

  return NextResponse.json({ ok: true });
}
