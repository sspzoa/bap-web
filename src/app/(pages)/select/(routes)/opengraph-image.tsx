import { OG_SIZE, renderOgCard } from "@/shared/lib/ogCard";
import { BRAND } from "@/sites/config";

export const runtime = "nodejs";
export const alt = BRAND.title;
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function SelectOpenGraphImage() {
  return renderOgCard({
    mark: BRAND.title,
    caption: BRAND.tagline,
  });
}
