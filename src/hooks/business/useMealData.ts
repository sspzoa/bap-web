import { useMealInitialization } from '@/hooks/business/useMealInitialization';
import { useResponsiveness, useScrollOpacity } from '@/hooks/ui';
import { fetchMealData } from '@/services/mealService';
import { currentDateAtom } from '@/store/atoms';
import { formatToDateString, getKoreanDate } from '@/utils/date';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays, format, subDays } from 'date-fns';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';

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

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['mealData', formattedDate],
    queryFn: () => fetchMealData(formattedDate),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const data = useMemo(() => responseData?.data || null, [responseData?.data]);
  const isError = useMemo(() => responseData?.isError || false, [responseData?.isError]);
  const errorMessage = useMemo(() => responseData?.error || '급식 정보가 없어요', [responseData?.error]);

  const prefetchQueries = useCallback(() => {
    const prevDate = subDays(currentDate, 1);
    const prevFormattedDate = formatToDateString(prevDate);
    queryClient.prefetchQuery({
      queryKey: ['mealData', prevFormattedDate],
      queryFn: () => fetchMealData(prevFormattedDate),
      staleTime: 1000 * 60 * 5,
      retry: false,
    });

    const nextDate = addDays(currentDate, 1);
    const nextFormattedDate = formatToDateString(nextDate);
    queryClient.prefetchQuery({
      queryKey: ['mealData', nextFormattedDate],
      queryFn: () => fetchMealData(nextFormattedDate),
      staleTime: 1000 * 60 * 5,
      retry: false,
    });
  }, [currentDate, queryClient]);

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
