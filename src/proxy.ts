import { type NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/shared/lib/apiBase";
import {
  HOME_QUERY_PARAM,
  isDocsPath,
  readSitePreference,
  readSiteQueryParam,
  SITE_PREFERENCE_COOKIE,
  SITE_PREFERENCE_COOKIE_OPTIONS,
  SITE_QUERY_PARAM,
} from "@/shared/lib/sitePreference";

function isKnownPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    isDocsPath(pathname) ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.webmanifest" ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image")
  );
}

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
  const siteFromQuery = readSiteQueryParam(request.nextUrl.searchParams.get(SITE_QUERY_PARAM));
  const preferredSiteId = readSitePreference(request.cookies.get(SITE_PREFERENCE_COOKIE)?.value);

  if (!isKnownPath(pathname)) {
    const home = new URL("/", request.url);
    home.search = request.nextUrl.search;
    return NextResponse.redirect(home);
  }

  if (isDocsPath(pathname)) {
    return NextResponse.redirect(new URL("/docs", API_BASE_URL));
  }

  if (pathname === "/" && siteFromQuery) {
    const destination = request.nextUrl.clone();
    destination.searchParams.delete(SITE_QUERY_PARAM);
    const response = NextResponse.redirect(destination);
    response.cookies.set(SITE_PREFERENCE_COOKIE, siteFromQuery, {
      ...SITE_PREFERENCE_COOKIE_OPTIONS,
      secure: request.nextUrl.protocol === "https:",
    });
    return response;
  }

  if (pathname === "/" && request.nextUrl.searchParams.has(HOME_QUERY_PARAM)) {
    const destination = request.nextUrl.clone();
    destination.searchParams.delete(HOME_QUERY_PARAM);
    const response = NextResponse.redirect(destination);
    response.cookies.set(SITE_PREFERENCE_COOKIE, "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
    return response;
  }

  return nextWithHeaders(request, preferredSiteId);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|icons|img|ads.txt|robots.txt).*)"],
};
