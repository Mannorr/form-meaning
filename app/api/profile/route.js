import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data } = await supabaseAdmin.from("memberships").select("*").eq("email", user.email).maybeSingle();
  return NextResponse.json({ user: { email: user.email, ...data } });
}

export async function PATCH(req) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const updates = await req.json();
  const { data, error } = await supabaseAdmin.from("memberships").update(updates).eq("email", user.email).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
