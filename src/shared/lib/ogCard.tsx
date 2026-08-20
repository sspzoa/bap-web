import { ImageResponse } from "next/og";
import { loadOgFont } from "@/shared/lib/ogFont";

export const OG_SIZE = { width: 1200, height: 630 };

export async function renderOgCard({
  title,
  heading,
  subtitle,
  lines,
}: {
  title: string;
  heading: string;
  subtitle?: string;
  lines: string[];
}) {
  const body = lines.length > 0 ? lines : [];
  const fontText = [title, heading, subtitle, ...body].filter(Boolean).join("");
  const fonts = await loadOgFont(fontText);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(160deg, #1a120c 0%, #3d2a1c 55%, #c45c26 100%)",
        color: "white",
        fontFamily: fonts.length > 0 ? "Noto Sans KR" : "sans-serif",
      }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 40, opacity: 0.72, marginBottom: 12 }}>{title}</div>
        <div style={{ fontSize: 64, lineHeight: 1.15 }}>{heading}</div>
        {subtitle ? <div style={{ fontSize: 36, opacity: 0.8, marginTop: 12 }}>{subtitle}</div> : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {body.length > 0 ? (
          body.map((line) => (
            <div key={line} style={{ fontSize: 34, opacity: 0.95, marginBottom: 10 }}>
              {line}
            </div>
          ))
        ) : (
          <div style={{ fontSize: 34, opacity: 0.8 }}>사이트를 선택하세요.</div>
        )}
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  );
}
