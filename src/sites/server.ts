import { headers } from "next/headers";
import { isSelectPath as isSelectPathname } from "@/shared/lib/sitePreference";

export async function getSiteId(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-site-id");
}

export async function isSelectPath(): Promise<boolean> {
  const headersList = await headers();
  return isSelectPathname(headersList.get("x-pathname") ?? "");
}
