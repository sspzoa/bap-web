import { useCallback, useEffect } from "react";
import { useMealQuery } from "@/shared/hooks/useMealQuery";
import type { MealFetchResult } from "@/shared/types/index";
import { useResponsiveness } from "@/app/(pages)/(home)/(hooks)/useResponsiveness";
import { useMealInitialization } from "@/sites/kdmhs/hooks/useMealInitialization";
import { useScrollOpacity } from "@/sites/kdmhs/hooks/useScrollOpacity";
import type { MealData } from "@/sites/kdmhs/types";

export const useMealData = (initialData?: MealFetchResult<MealData> | null) => {
  const query = useMealQuery<MealData>(initialData);
  const { scrollContainerRef, breakfastOpacity, lunchOpacity, dinnerOpacity, handleScroll, setOpacity } =
    useScrollOpacity();
  const { isMobile } = useResponsiveness();
  const { initialLoad, dateInitialized, setDateInitialized, setMealByTime } = useMealInitialization(
    scrollContainerRef,
    setOpacity,
    query.setCurrentDate,
  );

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
    } else {
      setOpacity(0, 0, 1);
    }
  }, [isMobile, setMealByTime, setOpacity]);

  useEffect(() => {
    handleMobileLayout();
  }, [handleMobileLayout]);

  return {
    currentDate: query.currentDate,
    setCurrentDate: query.setCurrentDate,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.errorMessage,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    handleRefresh: query.handleRefresh,
    setMealByTime,
    scrollContainerRef,
    breakfastOpacity,
    lunchOpacity,
    dinnerOpacity,
    isMobile,
    handleScroll,
    dateInitialized,
    initialLoad,
  };
};
