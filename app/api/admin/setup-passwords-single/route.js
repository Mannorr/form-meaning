import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const password = "formmeaning1!";

  try {
    let authUserId = null;

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError && createError.message.includes("already")) {
      // User exists — find them and update password
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      const existing = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (existing) {
        authUserId = existing.id;
        await supabaseAdmin.auth.admin.updateUserById(existing.id, { password });
      }
    } else if (!createError) {
      authUserId = newUser?.user?.id;
    }

    // Link user_id back to the membership row
    if (authUserId) {
      await supabaseAdmin
        .from("memberships")
        .update({ user_id: authUserId })
        .eq("email", email.toLowerCase().trim());
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
