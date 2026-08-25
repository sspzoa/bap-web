"use client";

import { useCallback, useRef, useState } from "react";
import type { MealSlotMeta } from "@/shared/types/index";
import { calculateOpacityFromScrollCached } from "@/shared/utils/mealTimingUtils";

export function useScrollOpacity(slots: MealSlotMeta[]) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [opacities, setOpacities] = useState<Record<string, number>>(() =>
    Object.fromEntries(slots.map((slot, index) => [slot.id, index === 0 ? 1 : 0])),
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollContainer = event.currentTarget;
      const totalWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      setOpacities(calculateOpacityFromScrollCached(scrollContainer.scrollLeft, totalWidth, slots));
    },
    [slots],
  );

  const setOpacity = useCallback((next: Record<string, number>) => {
    setOpacities(next);
  }, []);

  return {
    scrollContainerRef,
    opacities,
    handleScroll,
    setOpacity,
  };
}
