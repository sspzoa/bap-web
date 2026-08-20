import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: ["https://밥.net/sitemap.xml", "https://dflex.밥.net/sitemap.xml"],
  };
}
