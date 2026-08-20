import { summarizeDguMeal } from "@/sites/dgu/summarize";
import { summarizeKdmhsMeal } from "@/sites/kdmhs/summarize";
import type { SiteId } from "@/sites/config";

const SUMMARIZE_MEAL: Record<SiteId, (data: unknown) => string[]> = {
  kdmhs: summarizeKdmhsMeal,
  dgu: summarizeDguMeal,
};

export function summarizeMealPreview(siteId: SiteId, data: unknown): string[] {
  return SUMMARIZE_MEAL[siteId](data);
}
