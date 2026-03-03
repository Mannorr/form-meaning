import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ONE-TIME SETUP: Creates Supabase Auth accounts for all active members
// Visit /api/admin/setup-passwords to run this
// After running, DELETE this file from your repo

export async function GET() {
  const password = "formmeaning1!";
  const results = [];

  try {
    // Get all active members from memberships table
    const { data: members, error } = await supabaseAdmin
      .from("memberships")
      .select("email")
      .eq("status", "active");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!members || members.length === 0) {
      return NextResponse.json({ message: "No active members found." });
    }

    for (const member of members) {
      try {
        // Try to create auth account
        const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: member.email,
          password: password,
          email_confirm: true,
        });

        if (createError) {
          if (createError.message.includes("already")) {
            // User already exists — update their password
            const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
            const existing = users?.find(u => u.email === member.email);
            if (existing) {
              await supabaseAdmin.auth.admin.updateUserById(existing.id, { password });
              results.push({ email: member.email, status: "password_updated" });
            } else {
              results.push({ email: member.email, status: "exists_but_not_found" });
            }
          } else {
            results.push({ email: member.email, status: "error", message: createError.message });
          }
        } else {
          results.push({ email: member.email, status: "created" });
        }
      } catch (e) {
        results.push({ email: member.email, status: "error", message: e.message });
      }
    }

    return NextResponse.json({
      message: `Processed ${members.length} members`,
      password_used: password,
      results,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
