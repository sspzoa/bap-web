import { NextResponse, type NextRequest } from "next/server";

const HOSTNAME_TO_SITE: Record<string, string> = {
  "밥.net": "kdmhs",
  "xn--rh3b.net": "kdmhs",
  "www.xn--rh3b.net": "kdmhs",
  "상록원.밥.net": "dgu",
  "xn--3o2bl7m86e.xn--rh3b.net": "dgu",
};

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] || "";
  const siteId = HOSTNAME_TO_SITE[hostname] || "kdmhs";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-id", siteId);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|icons|img|ads.txt|robots.txt).*)"],
};
