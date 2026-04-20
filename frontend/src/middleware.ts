import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/org"];
const authRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const hasSession = req.cookies.get("hasSession")?.value === "true";

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
