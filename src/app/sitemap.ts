import type { MetadataRoute } from "next";
import { API_BASE_URL_DISPLAY } from "@/shared/lib/apiBase";
import { BRAND } from "@/sites/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BRAND.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${API_BASE_URL_DISPLAY}/docs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
