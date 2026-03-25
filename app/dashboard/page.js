import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import DashboardPage from "../components/dashboard-page";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch member profile
  const { data: member } = await supabaseAdmin
    .from("memberships")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  // Redirect non-members away
  if (!member || member.status !== "active") redirect("/login");

  // Fetch announcements (server-side, no client round-trip needed for initial load)
  const { data: announcements } = await supabaseAdmin
    .from("announcements")
    .select("id, title, body, pinned, created_at")
    .eq("status", "published")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch upcoming events — using correct column name: event_date
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("id, title, description, event_date, time, type, host, spots, location, status")
    .eq("status", "upcoming")
    .order("event_date", { ascending: true })
    .limit(4);

  // Fetch recent published content
  const { data: content } = await supabaseAdmin
    .from("content")
    .select("id, title, type, speaker, day, format, video_url, thumbnail_url, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch newest active members for the sidebar
  const { data: newMembers } = await supabaseAdmin
    .from("memberships")
    .select("name, email, discipline, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <DashboardPage
      user={{ email: user.email, ...member }}
      announcements={announcements || []}
      events={events || []}
      content={content || []}
      newMembers={newMembers || []}
    />
  );
}
