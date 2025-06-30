import { useMealInitialization } from '@/hooks/useMealInitialization';
import { useResponsiveness } from '@/hooks/useResponsiveness';
import { useScrollOpacity } from '@/hooks/useScrollOpacity';
import { fetchMealData } from '@/services/mealService';
import { currentDateAtom } from '@/store/atoms';
import { formatToDateString, toKoreanTime } from '@/utils/timeZoneUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays, subDays } from 'date-fns';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export const useMealData = () => {
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

  const { data, isLoading, error } = useQuery({
    queryKey: ['mealData', formattedDate],
    queryFn: () => fetchMealData(formattedDate),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isError = !!error;
  const errorMessage = error instanceof Error ? error.message : '급식 정보가 없어요';

  useEffect(() => {
    const koreanCurrentDate = toKoreanTime(currentDate);

    const prevDate = subDays(koreanCurrentDate, 1);
    const prevFormattedDate = formatToDateString(prevDate);
    queryClient.prefetchQuery({
      queryKey: ['mealData', prevFormattedDate],
      queryFn: () => fetchMealData(prevFormattedDate),
      staleTime: 1000 * 60 * 5,
      retry: false,
    });

    const nextDate = addDays(koreanCurrentDate, 1);
    const nextFormattedDate = formatToDateString(nextDate);
    queryClient.prefetchQuery({
      queryKey: ['mealData', nextFormattedDate],
      queryFn: () => fetchMealData(nextFormattedDate),
      staleTime: 1000 * 60 * 5,
      retry: false,
    });
  }, [currentDate, queryClient]);

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => {
      const koreanPrevDate = toKoreanTime(prevDate);
      return subDays(koreanPrevDate, 1);
    });
    setDateInitialized(true);
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => {
      const koreanPrevDate = toKoreanTime(prevDate);
      return addDays(koreanPrevDate, 1);
    });
    setDateInitialized(true);
  };

  const resetToToday = () => {
    const koreanTime = toKoreanTime(new Date());
    setCurrentDate(koreanTime);
    setDateInitialized(true);
  };

  useEffect(() => {
    if (isMobile) {
      setMealByTime();
    } else {
      setOpacity(0, 0, 1);
    }
  }, [isMobile]);

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