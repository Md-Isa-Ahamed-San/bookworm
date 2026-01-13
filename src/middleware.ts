/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const sessionResponse = await fetch(`${origin}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
  });

  const session = await sessionResponse.json();

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isRootPage = pathname === "/";

  // 1. If NOT logged in and trying to access a protected route
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If logged in and hitting Login, Register, or the Root (/)
  // Redirect them DIRECTLY to their dashboard/library
  if (session && (isAuthPage || isRootPage)) {
    const role = session.user?.role;
    const target = role === "ADMIN" ? "/admin/dashboard" : "/user/library";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 3. Role-based protection (Prevent non-admins from entering /admin)
  if (pathname.startsWith("/admin") && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/user/library", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|.*\\..*).*)",
  ],
};