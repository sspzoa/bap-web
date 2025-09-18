'use client';

import { MealSection } from '@/components/features/meal';
import { MealBackgroundImages, MealDesktopBackground, MealNavigationBar } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui';
import { useMealData } from '@/hooks/business';
import type { MealLayoutProps } from '@/types';
import { getCurrentMealTiming } from '@/utils/meal';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns/format';
import { ko } from 'date-fns/locale/ko';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const MealLayout = memo(function MealLayout({ initialData, initialDate, initialOpacity }: MealLayoutProps) {
  const {
    currentDate,
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
    handleScroll,
    dateInitialized,
    initialLoad,
  } = useMealData();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      const formattedInitialDate = format(initialDate, 'yyyy-MM-dd');
      queryClient.setQueryData(['mealData', formattedInitialDate], initialData);
    }
  }, [initialData, initialDate, queryClient]);

  const showMealContent = useMemo(() => {
    return dateInitialized || !initialLoad;
  }, [dateInitialized, initialLoad]);

  const backgroundOpacities = useMemo(
    () => ({
      breakfast: initialLoad ? initialOpacity.breakfast : breakfastOpacity,
      lunch: initialLoad ? initialOpacity.lunch : lunchOpacity,
      dinner: initialLoad ? initialOpacity.dinner : dinnerOpacity,
    }),
    [initialLoad, initialOpacity, breakfastOpacity, lunchOpacity, dinnerOpacity],
  );


  const handleResetToToday = useCallback(() => {
    resetToToday();
    setMealByTime();
  }, [resetToToday, setMealByTime]);

  const formattedCurrentDate = useMemo(() => {
    return dateInitialized ? format(currentDate, 'M월 d일 eeee', { locale: ko }) : '';
  }, [dateInitialized, currentDate]);

  const mealSectionProps = useMemo(
    () => ({
      breakfast: {
        icon: '/icon/breakfast.svg',
        title: '아침',
        regularItems: data?.breakfast?.regular || [],
        simpleMealItems: data?.breakfast?.simple || [],
        imageUrl: data?.breakfast?.image || '',
        id: 'breakfast',
      },
      lunch: {
        icon: '/icon/lunch.svg',
        title: '점심',
        regularItems: data?.lunch?.regular || [],
        simpleMealItems: data?.lunch?.simple || [],
        imageUrl: data?.lunch?.image || '',
        id: 'lunch',
      },
      dinner: {
        icon: '/icon/dinner.svg',
        title: '저녁',
        regularItems: data?.dinner?.regular || [],
        simpleMealItems: data?.dinner?.simple || [],
        imageUrl: data?.dinner?.image || '',
        id: 'dinner',
      },
    }),
    [data],
  );

  const commonMealProps = useMemo(
    () => ({
      isLoading,
      isError,
      errorMessage,
      showContent: showMealContent,
    }),
    [isLoading, isError, errorMessage, showMealContent],
  );

  return (
    <div className="h-svh flex items-center justify-center py-4 md:py-8 md:px-4 overflow-hidden relative">
      <MealBackgroundImages backgroundOpacities={backgroundOpacities} />
      <MealDesktopBackground />

      <div className="flex flex-col-reverse md:flex-col max-w-[1500px] md:px-4 w-full max-h-[900px] h-full gap-4 z-10">
        <MealNavigationBar
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onResetToToday={handleResetToToday}
          onRefresh={handleRefresh}
          formattedCurrentDate={formattedCurrentDate}
        />

        {isLoading && !initialLoad && (
          <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
            <LoadingSpinner />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex flex-row gap-4 w-full flex-1 overflow-x-auto snap-x snap-mandatory md:snap-none px-4 md:px-0">
          <MealSection {...mealSectionProps.breakfast} {...commonMealProps} />

          <MealSection {...mealSectionProps.lunch} {...commonMealProps} />

          <MealSection {...mealSectionProps.dinner} {...commonMealProps} />
        </div>
      </div>
    </div>
  );
});

export default MealLayout;
