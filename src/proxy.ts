import { type NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/shared/lib/apiBase";
import { isDocsPath, isSelectPath, readSitePreference, SITE_PREFERENCE_COOKIE } from "@/shared/lib/sitePreference";

function nextWithHeaders(request: NextRequest, siteId: string | null) {
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
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isDocsPath(pathname)) {
    return NextResponse.redirect(new URL("/docs", API_BASE_URL));
  }

  return nextWithHeaders(request, preferredSiteId);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|icons|img|ads.txt|robots.txt).*)"],
};
