import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // 🔹 Token de tu backend (cookie "token")
  const appToken = req.cookies.get("token")?.value;

  // 🔹 Token de NextAuth (almacenado en el callback "jwt")
  const jwt = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });

  // 🔹 Definir token preferido (siempre priorizamos el interno)
  const activeToken = appToken || (jwt?.internalJwt as string | undefined);

  const isAuthenticated = Boolean(activeToken);

  console.log("🔑 Token interno (cookie):", appToken);
  console.log("🔐 Token interno (session):", jwt?.internalJwt as string | undefined);

  const url = req.nextUrl.clone();
  const { pathname } = url;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname.startsWith("/auth/login");
  const isRootRoute = pathname === "/";

  // 🔒 Si no está autenticado → redirigir a login
  if (!isAuthenticated && (isDashboardRoute || isRootRoute)) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 🚫 Si ya está autenticado y va al login → dashboard
  if (isAuthenticated && isLoginRoute) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ⏩ Si entra a "/" autenticado → dashboard
  if (isAuthenticated && isRootRoute) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/auth/login",
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
