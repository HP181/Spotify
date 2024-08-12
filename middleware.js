import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow requests if the following is true:
  // 1) It's a request for the next-auth session or provider fetching
  // 2) The token exists
  // 3) It's a request to the login page
  // 4) It's a request to a public resource (e.g., static files)
  if (
    pathname.includes("/api/auth") ||
    pathname === "/login" ||
    token ||
    pathname.startsWith("/_next") || // Allow Next.js internal requests
    pathname.startsWith("/static") || // Allow static file requests
    pathname.startsWith("/favicon.ico") // Allow favicon requests
  ) {
    return NextResponse.next();
  }

  // Redirect them to the login page if they don't have a token and are requesting any other page
  return NextResponse.redirect(new URL("/login", req.url));
}
