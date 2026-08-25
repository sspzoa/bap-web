import { cache } from "react";
import { API_BASE_URL } from "@/shared/lib/apiBase";
import type { CatalogResponse, SitePresentation } from "@/shared/types/index";

export const getCatalog = cache(async (): Promise<SitePresentation[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return [];
    }

    const body = (await response.json()) as CatalogResponse;
    if (!Array.isArray(body.providers)) {
      return [];
    }

    return body.providers.filter((site) => site?.id && site.basePath && Array.isArray(site.meals));
  } catch {
    return [];
  }
});

export function findSite(catalog: SitePresentation[], siteId: string | null | undefined): SitePresentation | null {
  if (!siteId) {
    return null;
  }

  return catalog.find((site) => site.id === siteId) ?? null;
}
