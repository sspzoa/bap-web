import { headers } from "next/headers";
import { isSelectPath as isSelectPathname } from "@/shared/lib/sitePreference";
import { isSiteId, type SiteId } from "@/sites/config";

export async function getSiteId(): Promise<SiteId | null> {
  const headersList = await headers();
  const siteId = headersList.get("x-site-id");
  return isSiteId(siteId) ? siteId : null;
}

export async function isSelectPath(): Promise<boolean> {
  const headersList = await headers();
  return isSelectPathname(headersList.get("x-pathname") ?? "");
}
