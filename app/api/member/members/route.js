import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: member } = await supabaseAdmin
    .from("memberships")
    .select("id, status")
    .eq("email", user.email)
    .maybeSingle();

  if (!member || member.status !== "active") {
    return NextResponse.json({ error: "Active membership required" }, { status: 403 });
  }

  // Only return safe public fields — no paid, payment_ref, admin_approved etc.
  const { data, error } = await supabaseAdmin
    .from("memberships")
    .select("id, name, email, discipline, bio, portfolio, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
