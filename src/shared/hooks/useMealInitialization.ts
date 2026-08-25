"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { prefetchMealDate } from "@/shared/lib/queryKeys";
import type { PublicDayMenu } from "@/shared/types/index";
import { getMealDisplayDate } from "@/shared/utils/dateUtils";
import { getCurrentMealTiming } from "@/shared/utils/mealTimingUtils";
import { formatToDateString, getKoreanDate } from "@/shared/utils/timeZoneUtils";
import { useSite } from "@/sites/context";

export const useMealInitialization = (
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  setOpacity: (opacities: Record<string, number>) => void,
  updateCurrentDate?: (date: Date) => void,
) => {
  const site = useSite();
  const [initialLoad, setInitialLoad] = useState(true);
  const [dateInitialized, setDateInitialized] = useState(false);
  const queryClient = useQueryClient();

  const setMealByTime = useCallback(() => {
    if (!scrollContainerRef?.current || site.meals.length === 0) {
      return;
    }

    const now = getKoreanDate();
    const displayDate = getMealDisplayDate(now);
    const scrollContainer = scrollContainerRef.current;
    const sectionWidth = scrollContainer.scrollWidth / site.meals.length;
    const mealTiming = getCurrentMealTiming(site.meals);
    const rolledOver = formatToDateString(displayDate) !== formatToDateString(now);

    if (rolledOver) {
      void prefetchMealDate<PublicDayMenu>(queryClient, site.id, site.basePath, formatToDateString(displayDate));
    }

    scrollContainer.scrollLeft = mealTiming.scrollPosition * sectionWidth;
    setOpacity(mealTiming.opacities);
    setDateInitialized(true);

    if (rolledOver && updateCurrentDate) {
      updateCurrentDate(displayDate);
    }
  }, [scrollContainerRef, setOpacity, queryClient, updateCurrentDate, site]);

  useEffect(() => {
    if (!initialLoad) {
      return;
    }

    if (typeof window !== "undefined") {
      setTimeout(() => {
        setMealByTime();
        setInitialLoad(false);
      }, 0);
    }
  }, [initialLoad, setMealByTime]);

  return {
    initialLoad,
    dateInitialized,
    setDateInitialized,
    setMealByTime,
  };
};
