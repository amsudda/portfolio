import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/token";

/**
 * Optimistic auth gate for admin pages: bounces visitors without a valid session
 * cookie to the login screen. Pages and server actions re-check against the DB.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    return session ? NextResponse.redirect(new URL("/admin/projects", request.url)) : NextResponse.next();
  }

  if (!session) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
