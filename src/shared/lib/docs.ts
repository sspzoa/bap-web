import { cache } from "react";
import { API_BASE_URL } from "@/shared/lib/apiBase";
import type { ApiDocsResponse } from "@/shared/types/index";

export const getApiDocs = cache(async (): Promise<ApiDocsResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as ApiDocsResponse;
    if (!body.docs || !Array.isArray(body.providers)) {
      return null;
    }

    return body;
  } catch {
    return null;
  }
});
