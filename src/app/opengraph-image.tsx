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
  const config = getSiteConfig(siteId);
  const date = getInitialDateForServer();
  const dateLabel = formatToDateString(date);
  const meal = await getMealDataServerSide(config.apiPath, dateLabel);
  const items = summarizeMealPreview(siteId, meal?.data);
  const displayDate = `${date.getMonth() + 1}월 ${date.getDate()}일 식단`;
  const fontText = [config.title, config.schoolName, displayDate, ...items].join("");
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
        <div style={{ fontSize: 40, opacity: 0.72 }}>{config.title}</div>
        <div style={{ fontSize: 64, lineHeight: 1.15 }}>{config.schoolName}</div>
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
          <div style={{ fontSize: 34, opacity: 0.8 }}>{config.description}</div>
        )}
      </div>
    </div>,
    { ...size, fonts },
  );
}
