import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
import DashboardPage from "../components/dashboard-page";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch member profile
  const { data: member } = await supabaseAdmin.from("memberships").select("*").eq("email", user?.email).maybeSingle();
  
  // Fetch announcements
  const { data: announcements } = await supabaseAdmin.from("announcements").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(5);
  
  // Fetch upcoming events
  const { data: events } = await supabaseAdmin.from("events").select("*").gte("date", new Date().toISOString().split("T")[0]).order("date", { ascending: true }).limit(4);
  
  // Fetch recent content
  const { data: content } = await supabaseAdmin.from("content").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(4);
  
  // Fetch new members
  const { data: newMembers } = await supabaseAdmin.from("memberships").select("name, discipline, created_at").eq("status", "active").order("created_at", { ascending: false }).limit(4);

  return <DashboardPage 
    user={{ email: user?.email, ...member }} 
    announcements={announcements || []} 
    events={events || []} 
    content={content || []} 
    newMembers={newMembers || []} 
  />;
}
