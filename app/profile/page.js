import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import ProfilePage from "../components/profile-page";

export const dynamic = "force-dynamic";

export default async function Profile() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabaseAdmin
    .from("memberships")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (!member || member.status !== "active") redirect("/login");

  return <ProfilePage user={{ email: user.email, ...member }} />;
}
