import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token")?.value || "";
  const path = request.nextUrl.pathname;

  // If the user has token it means they should not be allowed to visit public pages
  if (token) {
    if (path === "/sign-in" || path === "/" || path === "/sign-up") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If the user has no token it means they should not be allowed to visit private pages
  if (!token) {
    if (path === "/dashboard/:path*") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*"],
};
