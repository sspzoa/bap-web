"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { prefetchMealDate } from "@/shared/lib/queryKeys";
import { getMealDisplayDate } from "@/shared/utils/dateUtils";
import { formatToDateString, getKoreanDate } from "@/shared/utils/timeZoneUtils";
import { SITES } from "@/sites/config";
import { DGU_SCROLL_SECTIONS, getCurrentMealTiming } from "@/sites/dgu/utils/mealTimingUtils";
import type { DayMenu } from "@/sites/dgu/types";

export const useMealInitialization = (
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  setOpacity: (lunch: number, dinner: number) => void,
  updateCurrentDate?: (date: Date) => void,
) => {
  const { id: siteId, apiPath } = SITES.dgu;
  const [initialLoad, setInitialLoad] = useState(true);
  const [dateInitialized, setDateInitialized] = useState(false);
  const queryClient = useQueryClient();

  const setMealByTime = useCallback(() => {
    if (!scrollContainerRef?.current) return;

    const now = getKoreanDate();
    const displayDate = getMealDisplayDate(now);
    const scrollContainer = scrollContainerRef.current;
    const sectionWidth = scrollContainer.scrollWidth / DGU_SCROLL_SECTIONS;
    const mealTiming = getCurrentMealTiming();
    const rolledOver = formatToDateString(displayDate) !== formatToDateString(now);

    if (rolledOver) {
      void prefetchMealDate<DayMenu>(queryClient, siteId, apiPath, formatToDateString(displayDate));
    }

    scrollContainer.scrollLeft = mealTiming.scrollPosition * sectionWidth;
    setOpacity(mealTiming.opacity.lunch, mealTiming.opacity.dinner);
    setDateInitialized(true);

    if (rolledOver && updateCurrentDate) {
      updateCurrentDate(displayDate);
    }
  }, [scrollContainerRef, setOpacity, queryClient, updateCurrentDate, apiPath, siteId]);

  useEffect(() => {
    if (!initialLoad) return;

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
