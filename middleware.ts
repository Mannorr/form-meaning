import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication
const MEMBER_ROUTES = ["/dashboard", "/library", "/community", "/events", "/profile"];
// Routes that require admin cookie
const ADMIN_ROUTES = ["/admin"];
// Routes only for unauthenticated users (redirect logged-in users away)
const AUTH_ROUTES = ["/login", "/join"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create a response we can modify
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect member routes — redirect to login if not authenticated
  if (MEMBER_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect admin routes — check for admin session cookie
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route)) && !pathname.startsWith("/admin/login")) {
    const adminSession = request.cookies.get("admin-auth");
    if (!adminSession?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect already-logged-in users away from login/join
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon-192.png|apple-touch-icon.png|og-image.png|logo.png|api/).*)",
  ],
};
