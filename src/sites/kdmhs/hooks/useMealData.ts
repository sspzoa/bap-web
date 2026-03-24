import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, subDays } from "date-fns";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { currentDateAtom } from "@/app/(pages)/(home)/(atoms)/currentDateAtom";
import { useResponsiveness } from "@/app/(pages)/(home)/(hooks)/useResponsiveness";
import { SITES } from "@/sites/config";
import { useSiteId } from "@/sites/context";
import type { MealData } from "@/sites/kdmhs/types";
import { useMealInitialization } from "@/sites/kdmhs/hooks/useMealInitialization";
import { useScrollOpacity } from "@/sites/kdmhs/hooks/useScrollOpacity";
import { fetchMealData, refreshMealData } from "@/shared/lib/mealService";
import { ERROR_MESSAGES } from "@/shared/lib/constants";
import { formatToDateString, getKoreanDate } from "@/shared/utils/timeZoneUtils";

export const useMealData = () => {
  const siteId = useSiteId();
  const apiPath = SITES[siteId].apiPath;
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const formattedDate = formatToDateString(currentDate);
  const queryClient = useQueryClient();

  const { scrollContainerRef, breakfastOpacity, lunchOpacity, dinnerOpacity, handleScroll, setOpacity } =
    useScrollOpacity();

  const { isMobile } = useResponsiveness();

  const { initialLoad, dateInitialized, setDateInitialized, setMealByTime } = useMealInitialization(
    scrollContainerRef,
    setOpacity,
    setCurrentDate,
  );

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["mealData", formattedDate],
    queryFn: () => fetchMealData(apiPath, formattedDate),
    staleTime: 300000,
    retry: false,
  });

  const data = useMemo(() => (responseData?.data as MealData | null) ?? null, [responseData?.data]);
  const isError = useMemo(() => responseData?.isError || false, [responseData?.isError]);
  const errorMessage = useMemo(
    () => responseData?.error || ERROR_MESSAGES.kdmhs.NO_MEAL_DATA,
    [responseData?.error],
  );

  const prefetchQueries = useCallback(() => {
    const prevDate = subDays(currentDate, 1);
    const prevFormattedDate = formatToDateString(prevDate);
    queryClient.prefetchQuery({
      queryKey: ["mealData", prevFormattedDate],
      queryFn: () => fetchMealData(apiPath, prevFormattedDate),
      staleTime: 300000,
      retry: false,
    });

    const nextDate = addDays(currentDate, 1);
    const nextFormattedDate = formatToDateString(nextDate);
    queryClient.prefetchQuery({
      queryKey: ["mealData", nextFormattedDate],
      queryFn: () => fetchMealData(apiPath, nextFormattedDate),
      staleTime: 300000,
      retry: false,
    });
  }, [currentDate, queryClient, apiPath]);

  useEffect(() => {
    prefetchQueries();
  }, [prefetchQueries]);

  const handlePrevDay = useCallback(() => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
    setDateInitialized(true);
  }, [setCurrentDate, setDateInitialized]);

  const handleNextDay = useCallback(() => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
    setDateInitialized(true);
  }, [setCurrentDate, setDateInitialized]);

  const resetToToday = useCallback(() => {
    setCurrentDate(getKoreanDate());
    setDateInitialized(true);
  }, [setCurrentDate, setDateInitialized]);

  const handleRefresh = useCallback(async () => {
    try {
      const refreshedData = await refreshMealData(apiPath, formattedDate);
      queryClient.setQueryData(["mealData", formattedDate], refreshedData);
    } catch {
      queryClient.invalidateQueries({ queryKey: ["mealData", formattedDate] });
    }
  }, [formattedDate, queryClient, apiPath]);

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
    currentDate,
    setCurrentDate,
    data,
    isLoading,
    isError,
    errorMessage,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    handleRefresh,
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
