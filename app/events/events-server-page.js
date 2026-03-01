import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
import EventsPage from "../components/events-page";

export default async function Events() {
  const today = new Date().toISOString().split("T")[0];
  const { data: upcoming } = await supabaseAdmin.from("events").select("*").gte("date", today).order("date", { ascending: true });
  const { data: past } = await supabaseAdmin.from("events").select("*").lt("date", today).order("date", { ascending: false });
  return <EventsPage upcoming={upcoming || []} past={past || []} />;
}
