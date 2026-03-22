import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Define domains to exclude from subdomain logic (main app / admin)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // 1. Dashboard / Admin
  if (hostname.startsWith("app.") || hostname.startsWith("admin.")) {
    return NextResponse.rewrite(new URL(`/dashboard${path}`, request.url));
  }

  // 2. Subdomain as Tenant (e.g., lojinha.localhost:3000)
  const subdomain = hostname.replace(`.${rootDomain}`, "");

  if (subdomain && subdomain !== rootDomain && subdomain !== "www") {
    // Check if it's already rewritten or part of internal assets
    if (path.startsWith("/_next") || path.startsWith("/api")) return NextResponse.next();
    
    // Internal rewrite: URL looks like subdomain but server sees /[tenant]
    return NextResponse.rewrite(new URL(`/${subdomain}${path}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images, /favicon.ico (static assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
