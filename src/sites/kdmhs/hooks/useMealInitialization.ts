import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { prefetchMealDate } from "@/shared/lib/queryKeys";
import { getMealDisplayDate } from "@/shared/utils/dateUtils";
import { formatToDateString, getKoreanDate } from "@/shared/utils/timeZoneUtils";
import { SITES } from "@/sites/config";
import { getCurrentMealTiming, KDMHS_SCROLL_SECTIONS } from "@/sites/kdmhs/utils/mealTimingUtils";
import type { MealData } from "@/sites/kdmhs/types";

export const useMealInitialization = (
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  setOpacity: (breakfast: number, lunch: number, dinner: number) => void,
  updateCurrentDate?: (date: Date) => void,
) => {
  const { id: siteId, apiPath } = SITES.kdmhs;
  const [initialLoad, setInitialLoad] = useState(true);
  const [dateInitialized, setDateInitialized] = useState(false);
  const queryClient = useQueryClient();

  const setMealByTime = useCallback(() => {
    if (!scrollContainerRef?.current) return;

    const now = getKoreanDate();
    const displayDate = getMealDisplayDate(now);
    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth / KDMHS_SCROLL_SECTIONS;
    const mealTiming = getCurrentMealTiming();
    const rolledOver = formatToDateString(displayDate) !== formatToDateString(now);

    if (rolledOver) {
      void prefetchMealDate<MealData>(queryClient, siteId, apiPath, formatToDateString(displayDate));
    }

    scrollContainer.scrollLeft = mealTiming.scrollPosition * scrollWidth;
    setOpacity(mealTiming.opacity.breakfast, mealTiming.opacity.lunch, mealTiming.opacity.dinner);
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
