import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://밥.net",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
