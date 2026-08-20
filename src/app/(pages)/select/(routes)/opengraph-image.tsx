import { OG_SIZE, renderOgCard } from "@/shared/lib/ogCard";

export const runtime = "nodejs";
export const alt = "사이트 선택";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function SelectOpenGraphImage() {
  return renderOgCard({
    title: "밥.net",
    heading: "사이트 선택",
    lines: ["학교별 식단. 사이트를 선택하세요."],
  });
}
