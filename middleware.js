import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Define paths that require authentication
  const protectedPaths = ["/dashboard"];
  const isPathProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Redirect to sign-in if not authenticated and trying to access protected route
  if (isPathProtected && !token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*"],
};
