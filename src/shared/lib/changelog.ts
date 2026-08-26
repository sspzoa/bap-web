import { cache } from "react";
import { API_BASE_URL } from "@/shared/lib/apiBase";
import type { ChangelogResponse } from "@/shared/types/index";

export const getChangelog = cache(async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/changelog`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return "";
    }

    const body = (await response.json()) as ChangelogResponse;
    return typeof body.markdown === "string" ? body.markdown : "";
  } catch {
    return "";
  }
});
