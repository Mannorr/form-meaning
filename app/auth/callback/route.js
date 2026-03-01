import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies: { getAll() { return cookieStore.getAll(); }, setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } } }
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (type === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", req.url));
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
