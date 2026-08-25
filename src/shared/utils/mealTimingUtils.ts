import { CACHE_SETTINGS } from "@/shared/lib/constants";
import type { MealSlotMeta } from "@/shared/types/index";
import { getKoreanHours } from "@/shared/utils/timeZoneUtils";

export function getMealTimingByHour(hour: number, slots: MealSlotMeta[]) {
  const activeIndex = slots.findIndex((slot) => hour < slot.activeUntilHour);
  const index = activeIndex === -1 ? 0 : activeIndex;
  const opacities: Record<string, number> = {};

  for (const [slotIndex, slot] of slots.entries()) {
    opacities[slot.id] = slotIndex === index ? 1 : 0;
  }

  return {
    mealId: slots[index]?.id ?? "",
    scrollPosition: index,
    opacities,
  };
}

export function getCurrentMealTiming(slots: MealSlotMeta[]) {
  return getMealTimingByHour(getKoreanHours(), slots);
}

export function calculateOpacityFromScroll(scrollPosition: number, totalWidth: number, slots: MealSlotMeta[]) {
  const opacities: Record<string, number> = {};
  if (slots.length === 0) {
    return opacities;
  }

  if (slots.length === 1 || totalWidth <= 0) {
    for (const [index, slot] of slots.entries()) {
      opacities[slot.id] = index === 0 ? 1 : 0;
    }
    return opacities;
  }

  const progress = Math.min(Math.max(scrollPosition / totalWidth, 0), 1);
  const scaled = progress * (slots.length - 1);
  const from = Math.min(Math.floor(scaled), slots.length - 1);
  const to = Math.min(from + 1, slots.length - 1);
  const local = scaled - from;

  for (const [index, slot] of slots.entries()) {
    if (index === from && index === to) {
      opacities[slot.id] = 1;
    } else if (index === from) {
      opacities[slot.id] = 1 - local;
    } else if (index === to) {
      opacities[slot.id] = local;
    } else {
      opacities[slot.id] = 0;
    }
  }

  return opacities;
}

const opacityCache = new Map<string, Record<string, number>>();

export function calculateOpacityFromScrollCached(scrollPosition: number, totalWidth: number, slots: MealSlotMeta[]) {
  const cacheKey = `${slots.map((slot) => slot.id).join(",")}-${scrollPosition.toFixed(2)}-${totalWidth.toFixed(2)}`;
  const cached = opacityCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = calculateOpacityFromScroll(scrollPosition, totalWidth, slots);
  if (opacityCache.size > CACHE_SETTINGS.OPACITY_CACHE_MAX_SIZE) {
    opacityCache.clear();
  }
  opacityCache.set(cacheKey, result);
  return result;
}

export function lastSlotOpacities(slots: MealSlotMeta[]) {
  const opacities: Record<string, number> = {};
  const lastIndex = slots.length - 1;
  for (const [index, slot] of slots.entries()) {
    opacities[slot.id] = index === lastIndex ? 1 : 0;
  }
  return opacities;
}
