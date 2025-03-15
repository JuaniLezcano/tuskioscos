import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log(token)
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (!token && isOnDashboard) {
    // Usuario no autenticado, redirigir a "/"
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && req.nextUrl.pathname === "/") {
    // Usuario autenticado, redirigir a "/dashboard"
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Middleware aplicado en Home y Dashboard
};
