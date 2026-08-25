import { NextResponse, type NextRequest } from "next/server";
import {
  getPreferredSiteUrl,
  isBrandRootHost,
  isSelectPath,
  readSitePreference,
  SITE_PREFERENCE_COOKIE,
} from "@/shared/lib/sitePreference";
import { getSiteIdByHost, isSiteId, type SiteId } from "@/sites/config";

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
  const hostname = request.headers.get("host")?.split(":")[0] || "";
  const pathname = request.nextUrl.pathname;
  const devSiteId = process.env.NODE_ENV === "development" ? process.env.SITE_ID : undefined;

  if (isSiteId(devSiteId)) {
    return nextWithHeaders(request, devSiteId);
  }

  if (isBrandRootHost(hostname) && !isSelectPath(pathname) && pathname === "/") {
    const preferredSiteId = readSitePreference(request.cookies.get(SITE_PREFERENCE_COOKIE)?.value);

    if (!preferredSiteId) {
      return NextResponse.redirect(new URL("/select", request.url));
    }

    return NextResponse.redirect(getPreferredSiteUrl(preferredSiteId));
  }

  const siteId = getSiteIdByHost(hostname);
  return nextWithHeaders(request, siteId);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|icons|img|ads.txt|robots.txt).*)"],
};
