import type { MetadataRoute } from "next";
import { BRAND, getSiteConfig } from "@/sites/config";
import { getSiteId } from "@/sites/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const siteId = await getSiteId();
  const config = siteId
    ? getSiteConfig(siteId)
    : {
        siteName: BRAND.title,
        description: BRAND.tagline,
      };

  return {
    name: config.siteName,
    short_name: config.siteName,
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
