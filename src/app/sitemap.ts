import type { MetadataRoute } from "next";
import { SITES } from "@/sites/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...Object.values(SITES).map((site) => ({
      url: site.url,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    })),
    {
      url: "https://밥.net/select",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
