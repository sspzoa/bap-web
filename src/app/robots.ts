import type { MetadataRoute } from "next";
import { BRAND, SITES } from "@/sites/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [BRAND.url, ...Object.values(SITES).map((site) => site.url)].map((url) => `${url}/sitemap.xml`),
  };
}
