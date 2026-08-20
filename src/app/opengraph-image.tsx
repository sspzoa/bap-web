import { ImageResponse } from "next/og";
import { getMealDataServerSide } from "@/shared/lib/mealService";
import { loadOgFont } from "@/shared/lib/ogFont";
import { summarizeMealPreview } from "@/shared/lib/ogMeal";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { getSiteConfig } from "@/sites/config";
import { getSiteId } from "@/sites/server";

export const runtime = "nodejs";
export const alt = "오늘의 식단";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function OpenGraphImage() {
  const siteId = await getSiteId();
  const date = getInitialDateForServer();
  const displayDate = `${date.getMonth() + 1}월 ${date.getDate()}일 식단`;

  const config = siteId ? getSiteConfig(siteId) : null;
  const title = config?.title ?? "밥.net";
  const schoolName = config?.schoolName ?? "학교별 식단";
  const description = config?.description ?? "사이트를 선택하세요.";
  const items = config
    ? summarizeMealPreview(
        config.id,
        (await getMealDataServerSide(config.apiPath, formatToDateString(date)))?.data,
      )
    : [];
  const fontText = [title, schoolName, displayDate, description, ...items].join("");
  const fonts = await loadOgFont(fontText);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "linear-gradient(160deg, #1a120c 0%, #3d2a1c 55%, #c45c26 100%)",
        color: "white",
        fontFamily: fonts.length > 0 ? "Noto Sans KR" : "sans-serif",
      }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 40, opacity: 0.72 }}>{title}</div>
        <div style={{ fontSize: 64, lineHeight: 1.15 }}>{schoolName}</div>
        <div style={{ fontSize: 36, opacity: 0.8 }}>{displayDate}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item} style={{ fontSize: 34, opacity: 0.95 }}>
              {item}
            </div>
          ))
        ) : (
          <div style={{ fontSize: 34, opacity: 0.8 }}>{description}</div>
        )}
      </div>
    </div>,
    { ...size, fonts },
  );
}
