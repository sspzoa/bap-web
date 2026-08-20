import { NextResponse, type NextRequest } from "next/server";
import { getSiteIdByHost, isSiteId } from "@/sites/config";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] || "";
  const devSiteId = process.env.NODE_ENV === "development" ? process.env.SITE_ID : undefined;
  const siteId = (isSiteId(devSiteId) ? devSiteId : null) ?? getSiteIdByHost(hostname);

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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|icons|img|ads.txt|robots.txt).*)"],
};
