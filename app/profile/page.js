import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProfilePage from "../components/profile-page";

export default async function Profile() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: member } = await supabaseAdmin.from("memberships").select("*").eq("email", user?.email).maybeSingle();
  return <ProfilePage user={{ email: user?.email, ...member }} />;
}
