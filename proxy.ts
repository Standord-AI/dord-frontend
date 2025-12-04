import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("Authorization")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/merchant/login", request.url));
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const payload = JSON.parse(jsonPayload);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return NextResponse.redirect(
        new URL("/auth/merchant/login", request.url)
      );
    }
  } catch (e) {
    // If token decoding fails, redirect to login
    return NextResponse.redirect(new URL("/auth/merchant/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/dashboard/:path*",
};
