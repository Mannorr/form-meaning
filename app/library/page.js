import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LibraryPage from "../components/library-page";

export default async function Library() {
  const { data: content } = await supabaseAdmin.from("content").select("*").eq("status", "published").order("created_at", { ascending: false });
  return <LibraryPage content={content || []} />;
}
