import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  // Verify the request comes from an authenticated member
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Verify they have an active membership
  const { data: member } = await supabaseAdmin
    .from("memberships")
    .select("id, status")
    .eq("email", user.email)
    .maybeSingle();

  if (!member || member.status !== "active") {
    return NextResponse.json({ error: "Active membership required" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("announcements")
    .select("id, title, body, pinned, created_at")
    .eq("status", "published")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
