import type { SiteId } from "@/sites/config";

const PREVIEW_LIMIT = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function summarizeMealPreview(siteId: SiteId, data: unknown): string[] {
  if (!isRecord(data)) {
    return [];
  }

  if (siteId === "kdmhs") {
    const meals = ["lunch", "dinner", "breakfast"] as const;
    for (const meal of meals) {
      const item = isRecord(data[meal]) ? data[meal] : null;
      const items = [
        ...stringList(item?.regular),
        ...stringList(item?.plus),
        ...stringList(item?.simple),
      ];
      if (items.length > 0) {
        return items.slice(0, PREVIEW_LIMIT);
      }
    }
    return [];
  }

  const meals = Array.isArray(data.meals) ? data.meals : [];
  for (const meal of meals) {
    if (!isRecord(meal) || !Array.isArray(meal.corners)) {
      continue;
    }
    const items = meal.corners.flatMap((corner) => (isRecord(corner) ? stringList(corner.items) : []));
    if (items.length > 0) {
      return items.slice(0, PREVIEW_LIMIT);
    }
  }

  return [];
}
