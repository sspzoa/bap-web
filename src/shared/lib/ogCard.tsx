import { ImageResponse } from "next/og";
import { loadOgFont } from "@/shared/lib/ogFont";

export const OG_SIZE = { width: 1200, height: 630 };

export async function renderOgCard({ mark, caption }: { mark: string; caption: string }) {
  const fonts = await loadOgFont(`${mark}${caption}`);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        color: "#111111",
        fontFamily: fonts.length > 0 ? "Noto Sans KR" : "sans-serif",
      }}>
      <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 1 }}>{mark}</div>
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", marginTop: 28, opacity: 0.55 }}>
        {caption}
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  );
}
