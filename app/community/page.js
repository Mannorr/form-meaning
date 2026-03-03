import { supabaseAdmin } from "@/lib/supabaseAdmin";
import CommunityPage from "../components/community-page";

export const dynamic = "force-dynamic";

export default async function Community() {
  const { data: members } = await supabaseAdmin.from("memberships").select("id, name, email, discipline, bio, portfolio, created_at").eq("status", "active").order("created_at", { ascending: false });
  return <CommunityPage members={members || []} />;
}
