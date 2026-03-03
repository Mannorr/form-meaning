import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DashboardPage from "../components/dashboard-page";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  let user = {};
  let announcements = [];
  let events = [];
  let content = [];
  let newMembers = [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser?.email) {
      const { data: member } = await supabaseAdmin.from("memberships").select("*").eq("email", authUser.email).maybeSingle();
      user = { email: authUser.email, ...member };
    }
  } catch (e) { console.error("Dashboard auth error:", e.message); }

  try {
    const { data } = await supabaseAdmin.from("announcements").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(5);
    announcements = data || [];
  } catch (e) {}

  try {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabaseAdmin.from("events").select("*").gte("date", today).order("date", { ascending: true }).limit(4);
    events = data || [];
  } catch (e) {}

  try {
    const { data } = await supabaseAdmin.from("content").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(4);
    content = data || [];
  } catch (e) {}

  try {
    const { data } = await supabaseAdmin.from("memberships").select("name, email, discipline, created_at").eq("status", "active").order("created_at", { ascending: false }).limit(4);
    newMembers = data || [];
  } catch (e) {}

  return <DashboardPage user={user} announcements={announcements} events={events} content={content} newMembers={newMembers} />;
}
