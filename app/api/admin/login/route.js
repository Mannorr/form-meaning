import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin-auth", "true", { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60*60*24*7 });
    return res;
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
