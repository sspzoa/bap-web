const PREVIEW_LIMIT = 6;
const MEAL_ORDER = ["lunch", "dinner", "breakfast"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function summarizeKdmhsMeal(data: unknown): string[] {
  if (!isRecord(data)) {
    return [];
  }

  for (const meal of MEAL_ORDER) {
    const item = isRecord(data[meal]) ? data[meal] : null;
    const items = [...stringList(item?.regular), ...stringList(item?.plus), ...stringList(item?.simple)];
    if (items.length > 0) {
      return items.slice(0, PREVIEW_LIMIT);
    }
  }

  return [];
}
