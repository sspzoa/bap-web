import type { MetadataRoute } from "next";
import { findSite, getCatalog } from "@/shared/lib/catalog";
import { BRAND } from "@/sites/config";
import { getSiteId } from "@/sites/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const siteId = await getSiteId();
  const catalog = await getCatalog();
  const site = findSite(catalog, siteId);
  const name = site?.name ?? BRAND.title;
  const description = site?.description ?? BRAND.tagline;

  return {
    name,
    short_name: name,
    description,
    start_url: site ? "/" : "/select",
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
