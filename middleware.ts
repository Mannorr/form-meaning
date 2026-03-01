import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: any) {
  let res = NextResponse.next();
  const url = req.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach(({ name, value, options }: any) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected member routes — redirect to login if not authenticated
  const protectedPaths = ["/dashboard", "/library", "/community", "/events", "/profile"];
  const isProtected = protectedPaths.some(p => url.pathname.startsWith(p));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin protection — cookie-based
  if (url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login")) {
    const adminToken = req.cookies.get("admin-auth");
    if (!adminToken || adminToken.value !== "true") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Redirect logged-in users away from login/join pages
  if (user && (url.pathname === "/login" || url.pathname === "/join")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png|og-image.png|apple-touch-icon.png|icon-192.png).*)"],
};
