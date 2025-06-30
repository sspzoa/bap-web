import { CONFIG } from '@/config';
import { useMealInitialization } from '@/hooks/useMealInitialization';
import { useResponsiveness } from '@/hooks/useResponsiveness';
import { useScrollOpacity } from '@/hooks/useScrollOpacity';
import { fetchMealData } from '@/services/mealService';
import { currentDateAtom } from '@/store/atoms';
import { formatErrorMessage } from '@/utils/errors';
import { componentLogger } from '@/utils/logger';
import { formatToKoreanDateString, getCurrentKoreanTime } from '@/utils/timeZoneUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays, subDays } from 'date-fns';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

const logger = componentLogger('useMealData');

export const useMealData = () => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const formattedDate = formatToKoreanDateString(currentDate);
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
    logger.componentMount('useMealData');
    logger.debug('Hook initialized', {
      currentDate: formattedDate,
      isMobile,
      initialLoad,
    });

    return () => {
      logger.componentUnmount('useMealData');
    };
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['mealData', formattedDate],
    queryFn: async () => {
      const timer = logger.time('fetchMealData');
      try {
        const result = await fetchMealData(formattedDate);
        timer();
        logger.info('Meal data fetched successfully', { date: formattedDate });
        return result;
      } catch (error) {
        timer();
        logger.error('Failed to fetch meal data', { date: formattedDate, error });
        throw error;
      }
    },
    staleTime: CONFIG.CACHE.MEAL_DATA_STALE_TIME,
  });

  const isError = !!error;
  const errorMessage = error ? formatErrorMessage(error) : undefined;

  useEffect(() => {
    const prefetchTimer = logger.time('prefetchAdjacentDates');

    const prevDate = subDays(currentDate, 1);
    const prevFormattedDate = formatToKoreanDateString(prevDate);

    queryClient.prefetchQuery({
      queryKey: ['mealData', prevFormattedDate],
      queryFn: () => fetchMealData(prevFormattedDate),
      staleTime: CONFIG.CACHE.PREFETCH_STALE_TIME,
    });

    const nextDate = addDays(currentDate, 1);
    const nextFormattedDate = formatToKoreanDateString(nextDate);

    queryClient.prefetchQuery({
      queryKey: ['mealData', nextFormattedDate],
      queryFn: () => fetchMealData(nextFormattedDate),
      staleTime: CONFIG.CACHE.PREFETCH_STALE_TIME,
    });

    prefetchTimer();
    logger.debug('Prefetched adjacent dates', {
      current: formattedDate,
      prev: prevFormattedDate,
      next: nextFormattedDate,
    });
  }, [currentDate, queryClient, formattedDate]);

  const handlePrevDay = useCallback(() => {
    logger.action('navigatePrevDay', { currentDate: formattedDate });
    setCurrentDate((prevDate) => {
      const newDate = subDays(prevDate, 1);
      logger.navigation(formattedDate, formatToKoreanDateString(newDate));
      return newDate;
    });
    setDateInitialized(true);
  }, [formattedDate, setCurrentDate, setDateInitialized]);

  const handleNextDay = useCallback(() => {
    logger.action('navigateNextDay', { currentDate: formattedDate });
    setCurrentDate((prevDate) => {
      const newDate = addDays(prevDate, 1);
      logger.navigation(formattedDate, formatToKoreanDateString(newDate));
      return newDate;
    });
    setDateInitialized(true);
  }, [formattedDate, setCurrentDate, setDateInitialized]);

  const resetToToday = useCallback(() => {
    logger.action('resetToToday', { currentDate: formattedDate });
    const today = getCurrentKoreanTime();
    setCurrentDate(today);
    setDateInitialized(true);
    logger.navigation(formattedDate, formatToKoreanDateString(today));
  }, [formattedDate, setCurrentDate, setDateInitialized]);

  useEffect(() => {
    logger.debug('Responsive behavior changed', { isMobile });

    if (isMobile) {
      setMealByTime();
    } else {
      setOpacity(0, 0, 1);
    }
  }, [isMobile, setMealByTime, setOpacity]);

  useEffect(() => {
    if (data) {
      logger.debug('Meal data loaded', {
        date: formattedDate,
        hasBreakfast: data.breakfast.regular.length > 0,
        hasLunch: data.lunch.regular.length > 0,
        hasDinner: data.dinner.regular.length > 0,
      });
    }
  }, [data, formattedDate]);

  useEffect(() => {
    if (error) {
      logger.error('Meal data error', {
        date: formattedDate,
        error: formatErrorMessage(error),
      });
    }
  }, [error, formattedDate]);

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
