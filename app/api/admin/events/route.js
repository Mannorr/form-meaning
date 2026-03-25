import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*, event_rsvps(count)")
    .order("event_date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Flatten RSVP count onto each event object
  const events = (data || []).map(e => ({
    ...e,
    rsvp_count: e.event_rsvps?.[0]?.count ?? 0,
    event_rsvps: undefined,
  }));
  return NextResponse.json({ data: events });
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.event_date && !body.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin.from("events").insert([body]).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: { ...data, rsvp_count: 0 } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, ...updates } = await req.json();
    const { data, error } = await supabaseAdmin.from("events").update(updates).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const { error } = await supabaseAdmin.from("events").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
