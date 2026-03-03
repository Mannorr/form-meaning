import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data } = await supabaseAdmin.from("event_rsvps").select("event_id").eq("email", user.email);
  return NextResponse.json({ rsvps: (data || []).map(r => r.event_id) });
}

export async function POST(req) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { event_id } = await req.json();
  if (!event_id) return NextResponse.json({ error: "event_id required" }, { status: 400 });

  // Check if already RSVP'd
  const { data: existing } = await supabaseAdmin.from("event_rsvps").select("id").eq("event_id", event_id).eq("email", user.email).maybeSingle();

  if (existing) {
    // Un-RSVP
    await supabaseAdmin.from("event_rsvps").delete().eq("id", existing.id);
    return NextResponse.json({ rsvpd: false });
  } else {
    // RSVP
    await supabaseAdmin.from("event_rsvps").insert([{ event_id, email: user.email }]);
    return NextResponse.json({ rsvpd: true });
  }
}
