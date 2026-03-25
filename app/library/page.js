import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import LibraryPage from "../components/library-page";

export const dynamic = "force-dynamic";

export default async function Library() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabaseAdmin
    .from("memberships")
    .select("status")
    .eq("email", user.email)
    .maybeSingle();

  if (!member || member.status !== "active") redirect("/login");

  const { data: content } = await supabaseAdmin
    .from("content")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return <LibraryPage content={content || []} />;
}
