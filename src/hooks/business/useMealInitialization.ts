import { fetchMealData } from '@/services/mealService';
import { formatToDateString, getKoreanDate, getKoreanHours } from '@/utils/date';
import { getCurrentMealTiming } from '@/utils/meal';
import { useQueryClient } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useMealInitialization = (
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  setOpacity: (breakfast: number, lunch: number, dinner: number) => void,
  updateCurrentDate?: (date: Date) => void,
) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const [dateInitialized, setDateInitialized] = useState(false);
  const queryClient = useQueryClient();

  const setMealByTime = useCallback(() => {
    if (!scrollContainerRef?.current) return;

    const now = getKoreanDate();
    const koreanHour = getKoreanHours();
    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth / 3;

    const mealTiming = getCurrentMealTiming();
    let newDate = now;
    let shouldUpdateDate = false;

    if (koreanHour >= 20) {
      newDate = addDays(now, 1);
      shouldUpdateDate = true;

      const tomorrowFormatted = formatToDateString(newDate);
      queryClient.prefetchQuery({
        queryKey: ['mealData', tomorrowFormatted],
        queryFn: () => fetchMealData(tomorrowFormatted),
        staleTime: 300000, // 5 minutes
        retry: false,
      });
    }

    scrollContainer.scrollLeft = mealTiming.scrollPosition * scrollWidth;
    setOpacity(mealTiming.opacity.breakfast, mealTiming.opacity.lunch, mealTiming.opacity.dinner);

    setDateInitialized(true);

    if (shouldUpdateDate && updateCurrentDate) {
      updateCurrentDate(newDate);
    }
  }, [scrollContainerRef, setOpacity, queryClient, updateCurrentDate]);

  const timeoutValue = useMemo(() => 0, []);

  useEffect(() => {
    if (!initialLoad) return;

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        setMealByTime();
        setInitialLoad(false);
      }, timeoutValue);
    }
  }, [initialLoad, setMealByTime, timeoutValue]);

  return {
    initialLoad,
    dateInitialized,
    setDateInitialized,
    setMealByTime,
  };
};
