import { OG_SIZE, renderOgCard } from "@/shared/lib/ogCard";
import { getMealDataServerSide } from "@/shared/lib/mealService";
import { summarizeMealPreview } from "@/shared/lib/ogMeal";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { getSiteConfig } from "@/sites/config";
import { getSiteId } from "@/sites/server";

export const runtime = "nodejs";
export const alt = "오늘의 식단";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function OpenGraphImage() {
  try {
    const siteId = await getSiteId();
    const date = getInitialDateForServer();
    const config = siteId ? getSiteConfig(siteId) : null;
    const items = config
      ? summarizeMealPreview(
          config.id,
          (await getMealDataServerSide(config.apiPath, formatToDateString(date)))?.data,
        )
      : [];

    return renderOgCard({
      title: config?.title ?? "밥.net",
      heading: config?.schoolName ?? "학교별 식단",
      subtitle: `${date.getMonth() + 1}월 ${date.getDate()}일 식단`,
      lines: items.length > 0 ? items : [config?.description ?? "사이트를 선택하세요."],
    });
  } catch {
    return renderOgCard({
      title: "밥.net",
      heading: "학교별 식단",
      lines: ["사이트를 선택하세요."],
    });
  }
}
