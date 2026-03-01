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
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });
  if (!data?.session) return NextResponse.json({ error: "No session returned." }, { status: 401 });
  return NextResponse.json({ ok: true });
}
