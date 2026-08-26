import { headers } from "next/headers";

export async function getSiteId(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get("x-site-id");
}
