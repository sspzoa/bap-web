const PREVIEW_LIMIT = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function summarizeDguMeal(data: unknown): string[] {
  if (!isRecord(data) || !Array.isArray(data.meals)) {
    return [];
  }

  for (const meal of data.meals) {
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
