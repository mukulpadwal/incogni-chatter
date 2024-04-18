import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// This function can be marked `async` if using `await` inside
export default auth(async function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.csrf-token")?.value || "";
  const url = request.nextUrl;


  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL("/sign-in", request.url));

  }

  return NextResponse.next();
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
