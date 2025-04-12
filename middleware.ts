import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const jwt = await getToken({ req, secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET });

  const isAuthenticated = !!token || (!!jwt || false);
  console.log("🔐 JWT recibido de next-auth:", jwt);


  const url = req.nextUrl.clone();
  const { pathname } = url;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname.startsWith("/auth/login");
  const isRootRoute = pathname === "/";

  if (!isAuthenticated && (isDashboardRoute || isRootRoute)) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isLoginRoute) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isRootRoute && isAuthenticated) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/login", "/((?!api/auth|_next/static|_next/image|favicon.ico).*)"
  ],
};
