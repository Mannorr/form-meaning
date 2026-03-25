import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import EventsPage from "../components/events-page";

export const dynamic = "force-dynamic";

export default async function Events() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date().toISOString();

  // Upcoming: event_date >= now
  const { data: upcoming } = await supabaseAdmin
    .from("events")
    .select("*")
    .gte("event_date", now)
    .order("event_date", { ascending: true });

  // Past: event_date < now
  const { data: past } = await supabaseAdmin
    .from("events")
    .select("*")
    .lt("event_date", now)
    .order("event_date", { ascending: false });

  return <EventsPage upcoming={upcoming || []} past={past || []} />;
}
