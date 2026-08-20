import { headers } from "next/headers";
import { isSiteId, type SiteId } from "@/sites/config";

export async function getSiteId(): Promise<SiteId | null> {
  const headersList = await headers();
  const siteId = headersList.get("x-site-id");
  return isSiteId(siteId) ? siteId : null;
}

export async function getPathname(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-pathname") ?? "";
}

export async function isSelectPath(): Promise<boolean> {
  const pathname = await getPathname();
  return pathname === "/select" || pathname.startsWith("/select/");
}
