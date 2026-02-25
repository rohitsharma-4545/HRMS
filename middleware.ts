import { NextResponse } from "next/server";

export function middleware(req: any) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isPublicAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  if (!token) {
    if (isPublicAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)).*)",
  ],
};
