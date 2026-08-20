import { headers } from "next/headers";
import { isSiteId, type SiteId } from "@/sites/config";

export async function getSiteId(): Promise<SiteId | null> {
  const headersList = await headers();
  const siteId = headersList.get("x-site-id");
  return isSiteId(siteId) ? siteId : null;
}
