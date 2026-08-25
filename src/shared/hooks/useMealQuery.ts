import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, subDays } from "date-fns";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { currentDateAtom } from "@/app/(pages)/(home)/(atoms)/currentDateAtom";
import { MEAL_ERROR_MESSAGES } from "@/shared/lib/mealErrors";
import { mealQueryOptions, prefetchMealDate } from "@/shared/lib/queryKeys";
import type { MealFetchResult } from "@/shared/types/index";
import { getMealDisplayDate } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { useSite } from "@/sites/context";

export function useMealQuery<T>(initialData?: MealFetchResult<T> | null, initialFormattedDate?: string) {
  const site = useSite();
  const fallbackError = MEAL_ERROR_MESSAGES.noMealData;
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const formattedDate = formatToDateString(currentDate);
  const queryClient = useQueryClient();
  const seededInitialData =
    initialFormattedDate && formattedDate === initialFormattedDate ? (initialData ?? undefined) : undefined;

  const { data: responseData, isLoading } = useQuery({
    ...mealQueryOptions<T>(site.id, site.basePath, formattedDate),
    initialData: seededInitialData,
  });

  const data = responseData?.data ?? null;
  const isError = responseData?.isError ?? false;
  const errorMessage = responseData?.error || fallbackError;

  useEffect(() => {
    const prevFormattedDate = formatToDateString(subDays(currentDate, 1));
    const nextFormattedDate = formatToDateString(addDays(currentDate, 1));
    void prefetchMealDate<T>(queryClient, site.id, site.basePath, prevFormattedDate);
    void prefetchMealDate<T>(queryClient, site.id, site.basePath, nextFormattedDate);
  }, [currentDate, queryClient, site.basePath, site.id]);

  const handlePrevDay = useCallback(() => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  }, [setCurrentDate]);

  const handleNextDay = useCallback(() => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  }, [setCurrentDate]);

  const resetToToday = useCallback(() => {
    setCurrentDate(getMealDisplayDate());
  }, [setCurrentDate]);

  return {
    siteId: site.id,
    apiPath: site.basePath,
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
  };
}
