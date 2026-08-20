import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/sites/config";
import { getSiteId } from "@/sites/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const siteId = await getSiteId();
  const config = siteId
    ? getSiteConfig(siteId)
    : {
        manifestName: "밥.net",
        title: "밥.net",
        description: "학교별 식단. 사이트를 선택하세요.",
      };

  return {
    name: config.manifestName,
    short_name: config.title,
    description: config.description,
    start_url: siteId ? "/" : "/select",
    display: "fullscreen",
    orientation: "any",
    lang: "ko",
    background_color: "#1a120c",
    theme_color: "#1a120c",
    icons: [
      {
        src: "/favicon.ico",
        type: "image/x-icon",
        sizes: "16x16 32x32",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
