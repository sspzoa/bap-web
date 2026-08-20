import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, subDays } from "date-fns";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { currentDateAtom } from "@/app/(pages)/(home)/(atoms)/currentDateAtom";
import { mealQueryOptions, prefetchMealDate } from "@/shared/lib/queryKeys";
import { refreshMealData } from "@/shared/lib/mealService";
import type { MealFetchResult } from "@/shared/types/index";
import { getMealDisplayDate } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { SITES } from "@/sites/config";
import { useSiteId } from "@/sites/context";

export function useMealQuery<T>(initialData?: MealFetchResult<T> | null) {
  const siteId = useSiteId();
  const apiPath = SITES[siteId].apiPath;
  const fallbackError = SITES[siteId].errorMessages.noMealData;
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const formattedDate = formatToDateString(currentDate);
  const queryClient = useQueryClient();

  const { data: responseData, isLoading } = useQuery({
    ...mealQueryOptions<T>(siteId, apiPath, formattedDate),
    initialData: initialData ?? undefined,
  });

  const data = responseData?.data ?? null;
  const isError = responseData?.isError ?? false;
  const errorMessage = responseData?.error || fallbackError;

  useEffect(() => {
    const prevFormattedDate = formatToDateString(subDays(currentDate, 1));
    const nextFormattedDate = formatToDateString(addDays(currentDate, 1));
    void prefetchMealDate<T>(queryClient, siteId, apiPath, prevFormattedDate);
    void prefetchMealDate<T>(queryClient, siteId, apiPath, nextFormattedDate);
  }, [currentDate, queryClient, apiPath, siteId]);

  const handlePrevDay = useCallback(() => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  }, [setCurrentDate]);

  const handleNextDay = useCallback(() => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  }, [setCurrentDate]);

  const resetToToday = useCallback(() => {
    setCurrentDate(getMealDisplayDate());
  }, [setCurrentDate]);

  const handleRefresh = useCallback(async () => {
    try {
      const refreshedData = await refreshMealData<T>(apiPath, formattedDate);
      if (!refreshedData.isError) {
        queryClient.setQueryData(mealQueryOptions<T>(siteId, apiPath, formattedDate).queryKey, refreshedData);
        alert("Meal data refreshed.");
      }
    } catch {
      console.error("Failed to refresh meal data.");
    }
  }, [formattedDate, queryClient, apiPath, siteId]);

  return {
    siteId,
    apiPath,
    currentDate,
    setCurrentDate,
    formattedDate,
    data,
    isLoading,
    isError,
    errorMessage,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    handleRefresh,
  };
}
