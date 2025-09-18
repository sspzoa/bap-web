import { useMealInitialization } from '@/hooks/business/useMealInitialization';
import { useResponsiveness, useScrollOpacity } from '@/hooks/ui';
import { fetchMealData, refreshMealData } from '@/services/mealService';
import { currentDateAtom } from '@/store/atoms';
import { formatToDateString, getKoreanDate } from '@/utils/date';
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

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['mealData', formattedDate],
    queryFn: () => fetchMealData(formattedDate),
    staleTime: 300000, // 5 minutes
    retry: false,
  });

  const data = responseData?.data || null;
  const isError = responseData?.isError || false;
  const errorMessage = responseData?.error || '급식 정보가 없어요';

  const prefetchQueries = () => {
    const prevDate = subDays(currentDate, 1);
    const prevFormattedDate = formatToDateString(prevDate);
    queryClient.prefetchQuery({
      queryKey: ['mealData', prevFormattedDate],
      queryFn: () => fetchMealData(prevFormattedDate),
      staleTime: 300000, // 5 minutes
      retry: false,
    });

    const nextDate = addDays(currentDate, 1);
    const nextFormattedDate = formatToDateString(nextDate);
    queryClient.prefetchQuery({
      queryKey: ['mealData', nextFormattedDate],
      queryFn: () => fetchMealData(nextFormattedDate),
      staleTime: 300000, // 5 minutes
      retry: false,
    });
  };

  useEffect(() => {
    prefetchQueries();
  }, [prefetchQueries]);

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
    setDateInitialized(true);
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
    setDateInitialized(true);
  };

  const resetToToday = () => {
    setCurrentDate(getKoreanDate());
    setDateInitialized(true);
  };

  const handleRefresh = async () => {
    try {
      const refreshedData = await refreshMealData(formattedDate);
      queryClient.setQueryData(['mealData', formattedDate], refreshedData);
    } catch (error) {
      // Silent error handling - error is handled by React Query
    }
  };

  const handleMobileLayout = () => {
    if (isMobile) {
      setMealByTime();
    } else {
      setOpacity(0, 0, 1);
    }
  };

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
