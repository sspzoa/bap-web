import type { MetadataRoute } from "next";
import { SITES } from "@/sites/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return Object.values(SITES).flatMap((site) => [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site.url}/select`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]);
}
