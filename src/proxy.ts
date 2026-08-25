import { NextResponse, type NextRequest } from "next/server";
import { isSelectPath, readSitePreference, SITE_PREFERENCE_COOKIE } from "@/shared/lib/sitePreference";
import type { SiteId } from "@/sites/config";

function nextWithHeaders(request: NextRequest, siteId: SiteId | null) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (siteId) {
    requestHeaders.set("x-site-id", siteId);
  } else {
    requestHeaders.delete("x-site-id");
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const preferredSiteId = readSitePreference(request.cookies.get(SITE_PREFERENCE_COOKIE)?.value);

  if (isSelectPath(pathname)) {
    return nextWithHeaders(request, null);
  }

  if (pathname === "/" && !preferredSiteId) {
    return NextResponse.redirect(new URL("/select", request.url));
  }

  return nextWithHeaders(request, preferredSiteId);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|icons|img|ads.txt|robots.txt).*)"],
};
