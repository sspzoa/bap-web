"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useMealInitialization } from "@/shared/hooks/useMealInitialization";
import { useMealQuery } from "@/shared/hooks/useMealQuery";
import { useResponsiveness } from "@/shared/hooks/useResponsiveness";
import { useScrollOpacity } from "@/shared/hooks/useScrollOpacity";
import type { MealFetchResult, PublicDayMenu } from "@/shared/types/index";
import { lastSlotOpacities } from "@/shared/utils/mealTimingUtils";
import { useSite } from "@/sites/context";

export const useMealData = (initialData?: MealFetchResult<PublicDayMenu> | null, initialFormattedDate?: string) => {
  const site = useSite();
  const query = useMealQuery<PublicDayMenu>(initialData, initialFormattedDate);
  const { scrollContainerRef, opacities, handleScroll, setOpacity } = useScrollOpacity(site.meals);
  const { isMobile } = useResponsiveness();
  const { initialLoad, dateInitialized, setDateInitialized, setMealByTime } = useMealInitialization(
    scrollContainerRef,
    setOpacity,
    query.setCurrentDate,
  );
  const meals = useMemo(() => query.data?.meals ?? [], [query.data]);

  const handlePrevDay = useCallback(() => {
    query.handlePrevDay();
    setDateInitialized(true);
  }, [query.handlePrevDay, setDateInitialized]);

  const handleNextDay = useCallback(() => {
    query.handleNextDay();
    setDateInitialized(true);
  }, [query.handleNextDay, setDateInitialized]);

  const resetToToday = useCallback(() => {
    query.resetToToday();
    setDateInitialized(true);
  }, [query.resetToToday, setDateInitialized]);

  const handleMobileLayout = useCallback(() => {
    if (isMobile) {
      setMealByTime();
      return;
    }

    setOpacity(lastSlotOpacities(site.meals));
  }, [isMobile, setMealByTime, setOpacity, site.meals]);

  useEffect(() => {
    handleMobileLayout();
  }, [handleMobileLayout]);

  return {
    currentDate: query.currentDate,
    meals,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.errorMessage,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    setMealByTime,
    scrollContainerRef,
    opacities,
    handleScroll,
    dateInitialized,
    initialLoad,
  };
};
