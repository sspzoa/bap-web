import { useMealInitialization } from '@/hooks/useMealInitialization';
import { useResponsiveness } from '@/hooks/useResponsiveness';
import { useScrollOpacity } from '@/hooks/useScrollOpacity';
import { fetchMealData } from '@/services/mealService';
import { currentDateAtom } from '@/store/atoms';
import type { MealData } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays, format, subDays } from 'date-fns';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export const useMealData = (initialData?: MealData | null, initialDate?: Date) => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const queryClient = useQueryClient();

  const { scrollContainerRef, breakfastOpacity, lunchOpacity, dinnerOpacity, handleScroll, setOpacity } =
    useScrollOpacity();

  const { isMobile } = useResponsiveness();

  const { initialLoad, dateInitialized, setDateInitialized, setMealByTime } = useMealInitialization(
    scrollContainerRef,
    setOpacity,
    setCurrentDate,
  );

  useEffect(() => {
    if (initialData && initialDate) {
      const formattedInitialDate = format(initialDate, 'yyyy-MM-dd');
      queryClient.setQueryData(['mealData', formattedInitialDate], initialData);
    }
  }, [initialData, initialDate, queryClient]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['mealData', formattedDate],
    queryFn: () => fetchMealData(formattedDate),
    staleTime: 1000 * 60 * 5,
    retry: false,
    initialData: initialDate && format(initialDate, 'yyyy-MM-dd') === formattedDate ? initialData : undefined,
  });

  const isError = !!error;
  const errorMessage = error instanceof Error ? error.message : '급식 정보가 없어요';

  useEffect(() => {
    const prevDate = subDays(currentDate, 1);
    const prevFormattedDate = format(prevDate, 'yyyy-MM-dd');
    queryClient.prefetchQuery({
      queryKey: ['mealData', prevFormattedDate],
      queryFn: () => fetchMealData(prevFormattedDate),
      staleTime: 1000 * 60 * 5,
      retry: false,
    });

    const nextDate = addDays(currentDate, 1);
    const nextFormattedDate = format(nextDate, 'yyyy-MM-dd');
    queryClient.prefetchQuery({
      queryKey: ['mealData', nextFormattedDate],
      queryFn: () => fetchMealData(nextFormattedDate),
      staleTime: 1000 * 60 * 5,
      retry: false,
    });
  }, [currentDate, queryClient]);

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
    setDateInitialized(true);
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
    setDateInitialized(true);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
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
