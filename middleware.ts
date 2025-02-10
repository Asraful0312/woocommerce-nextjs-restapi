import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get("auth-token");

  // Define protected routes
  const protectedPaths = ["/orders", "/account", "/downloads"];
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Define auth pages that logged-in users shouldn't access
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to home if trying to access auth pages while logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/orders/:path*",
    "/account/:path*",
    "/downloads/:path*",
    // Auth pages
    "/login",
    "/register",
  ],
};
