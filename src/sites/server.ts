import { headers } from "next/headers";
import { SITES, type SiteId } from "@/sites/config";

export async function getSiteId(): Promise<SiteId> {
  const headersList = await headers();
  const siteId = headersList.get("x-site-id") as SiteId | null;
  return siteId && siteId in SITES ? siteId : "kdmhs";
}
