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

    let newDate = now;
    let shouldUpdateDate = false;

    if (koreanHour >= 20) {
      newDate = addDays(now, 1);
      shouldUpdateDate = true;

      scrollContainer.scrollLeft = 0;
      setOpacity(1, 0, 0);

      const tomorrowFormatted = formatToDateString(newDate);
      queryClient.prefetchQuery({
        queryKey: ['mealData', tomorrowFormatted],
        queryFn: () => fetchMealData(tomorrowFormatted),
        staleTime: 1000 * 60 * 5,
        retry: false,
      });
    } else if (koreanHour < 8) {
      scrollContainer.scrollLeft = 0;
      setOpacity(1, 0, 0);
    } else if (koreanHour >= 14) {
      scrollContainer.scrollLeft = scrollWidth * 2;
      setOpacity(0, 0, 1);
    } else {
      scrollContainer.scrollLeft = scrollWidth;
      setOpacity(0, 1, 0);
    }

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
