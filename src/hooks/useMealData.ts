import { useMealInitialization } from '@/hooks/useMealInitialization';
import { useResponsiveness } from '@/hooks/useResponsiveness';
import { useScrollOpacity } from '@/hooks/useScrollOpacity';
import { fetchMealData } from '@/services/mealService';
import { currentDateAtom } from '@/store/atoms';
import { formatToDateString, getKoreanTime } from '@/utils/timeZoneUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays, subDays } from 'date-fns';
import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';

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

  // 서버에서 계산한 날짜로 클라이언트 상태를 동기화하는 함수
  const initializeWithServerDate = useCallback((serverDate: Date) => {
    console.log(`Syncing client date with server date: ${serverDate.toISOString()}`);
    setCurrentDate(serverDate);
    setDateInitialized(true);
  }, [setCurrentDate, setDateInitialized]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['mealData', formattedDate],
    queryFn: () => fetchMealData(formattedDate),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isError = !!error;
  const errorMessage = error instanceof Error ? error.message : '급식 정보가 없어요';

  useEffect(() => {
    // 이미 한국 시간으로 계산된 currentDate를 그대로 사용
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

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => {
      // 이미 한국 시간으로 계산된 날짜를 그대로 사용
      return subDays(prevDate, 1);
    });
    setDateInitialized(true);
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => {
      // 이미 한국 시간으로 계산된 날짜를 그대로 사용
      return addDays(prevDate, 1);
    });
    setDateInitialized(true);
  };

  const resetToToday = () => {
    // 클라이언트에서 한국 시간으로 리셋
    const koreanTime = getKoreanTime();
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
    initializeWithServerDate, // 새로 추가된 함수
  };
};