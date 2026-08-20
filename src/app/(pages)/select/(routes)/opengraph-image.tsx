import { OG_SIZE, renderOgCard } from "@/shared/lib/ogCard";

export const runtime = "nodejs";
export const alt = "밥.net";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function SelectOpenGraphImage() {
  return renderOgCard({
    mark: "밥.net",
    caption: "사이트 선택",
  });
}
