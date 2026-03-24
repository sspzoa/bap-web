import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, subDays } from "date-fns";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { currentDateAtom } from "@/app/(pages)/(home)/(atoms)/currentDateAtom";
import { SITES } from "@/sites/config";
import { useSiteId } from "@/sites/context";
import type { CafeteriaData } from "@/sites/dgu/types";
import { useMealInitialization } from "@/sites/dgu/hooks/useMealInitialization";
import { fetchMealData, refreshMealData } from "@/shared/lib/mealService";
import { ERROR_MESSAGES } from "@/shared/lib/constants";
import { formatToDateString, getKoreanDate } from "@/shared/utils/timeZoneUtils";

export const useMealData = () => {
  const siteId = useSiteId();
  const apiPath = SITES[siteId].apiPath;
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const formattedDate = formatToDateString(currentDate);
  const queryClient = useQueryClient();

  const { initialLoad, dateInitialized, setDateInitialized } = useMealInitialization();

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["mealData", formattedDate],
    queryFn: () => fetchMealData(apiPath, formattedDate),
    staleTime: 300000,
    retry: false,
  });

  const data = useMemo(() => (responseData?.data as CafeteriaData | null) ?? null, [responseData?.data]);
  const isError = useMemo(() => responseData?.isError || false, [responseData?.isError]);
  const errorMessage = useMemo(
    () => responseData?.error || ERROR_MESSAGES.dgu.NO_MEAL_DATA,
    [responseData?.error],
  );
  const restaurants = useMemo(() => data?.restaurants || [], [data]);

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

  return {
    currentDate,
    setCurrentDate,
    data,
    restaurants,
    isLoading,
    isError,
    errorMessage,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    handleRefresh,
    dateInitialized,
    initialLoad,
  };
};
