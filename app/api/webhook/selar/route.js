import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Selar sends customer info in the webhook payload
    const email = body?.customer?.email?.trim().toLowerCase();
    const name = body?.customer?.name?.trim() || "";
    
    if (!email) {
      return NextResponse.json({ error: "No email in webhook payload" }, { status: 400 });
    }

    console.log(`Selar webhook received for: ${email}`);

    // Create or update membership
    const { data: existing } = await supabaseAdmin
      .from("memberships")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!existing) {
      await supabaseAdmin.from("memberships").insert([{
        email,
        name,
        paid: true,
        status: "active",
        admin_approved: true,
      }]);
    } else {
      await supabaseAdmin.from("memberships").update({ paid: true, status: "active", admin_approved: true }).eq("email", email);
    }

    // Generate a temporary password and create Supabase auth account
    const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
    let isNewUser = true;
    
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

    // If user already exists, update their password so they can still log in
    if (authError && authError.message.includes("already")) {
      isNewUser = false;
      // Find the existing user and update their password
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = users?.find(u => u.email === email);
      if (existingUser) {
        await supabaseAdmin.auth.admin.updateUserById(existingUser.id, { password: tempPassword });
      }
    } else if (authError) {
      console.error("Auth create error:", authError.message);
    }

    // Send welcome email with login credentials
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      
      await resend.emails.send({
        from: process.env.RESEND_FROM || "onboarding@resend.dev",
        to: email,
        subject: isNewUser ? "You're in | Form & Meaning" : "Payment confirmed | Form & Meaning",
        html: `
          <div style="font-family:sans-serif;line-height:1.7;max-width:520px;">
            <h2 style="margin:0 0 16px;">Welcome to Form & Meaning.</h2>
            <p>${name ? name + ", your" : "Your"} payment has been confirmed. You now have full access.</p>
            <p><strong>Your login details:</strong></p>
            <p>Email: ${email}<br>Password: ${tempPassword}</p>
            <p><strong>Please change your password after your first login.</strong></p>
            <p><a href="${siteUrl}/login" style="display:inline-block;padding:12px 24px;background:#D42B22;color:#fff;text-decoration:none;border-radius:4px;font-weight:600;">Log in now</a></p>
            <p style="margin-top:20px;">Once logged in, you'll land on your dashboard where you can access the conference videos, resources, events, and the community directory.</p>
            <p style="color:#888;font-size:13px;margin-top:24px;">Form & Meaning · Design is not decoration. It's a decision.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
