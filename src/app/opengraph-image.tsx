import { OG_SIZE, renderOgCard } from "@/shared/lib/ogCard";
import { getSiteConfig } from "@/sites/config";
import { getSiteId } from "@/sites/server";

export const runtime = "nodejs";
export const alt = "밥.net";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function OpenGraphImage() {
  const siteId = await getSiteId();
  const config = siteId ? getSiteConfig(siteId) : null;

  return renderOgCard({
    mark: config?.title ?? "밥.net",
    caption: config?.schoolName ?? "학교별 식단",
  });
}
