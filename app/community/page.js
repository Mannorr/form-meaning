import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import CommunityPage from "../components/community-page";

export const dynamic = "force-dynamic";

export default async function Community() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabaseAdmin
    .from("memberships")
    .select("status")
    .eq("email", user.email)
    .maybeSingle();

  if (!member || member.status !== "active") redirect("/login");

  const { data: members } = await supabaseAdmin
    .from("memberships")
    .select("id, name, email, discipline, bio, portfolio, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return <CommunityPage members={members || []} />;
}
