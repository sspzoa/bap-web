"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { ko } from "date-fns/locale/ko";
import { memo, useCallback, useEffect, useMemo } from "react";
import { MealNavigationBar } from "@/app/(pages)/(home)/(components)/mealNavigationBar";
import LoadingSpinner from "@/shared/components/common/loadingSpinner";
import { MealBackgroundImages } from "@/sites/dgu/components/mealBackgroundImages";
import { MealDesktopBackground } from "@/sites/dgu/components/mealDesktopBackground";
import { MealSection } from "@/sites/dgu/components/mealSection";
import { useMealData } from "@/sites/dgu/hooks/useMealData";
import type { Meal, MealLayoutProps } from "@/sites/dgu/types";

// 끼니 순서·운영시간을 고정해 스와이프 섹션과 배경(중식→점심, 석식→저녁)을 항상 2개로 맞춤.
const MEAL_ORDER: { time: string; operatingHours: string }[] = [
  { time: "중식", operatingHours: "11:30~14:00" },
  { time: "석식", operatingHours: "17:00~19:00" },
];

const MealLayout = memo(function MealLayout({ initialData, initialDate, initialOpacity }: MealLayoutProps) {
  const {
    currentDate,
    meals,
    isLoading,
    isError,
    errorMessage,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    handleRefresh,
    setMealByTime,
    scrollContainerRef,
    lunchOpacity,
    dinnerOpacity,
    handleScroll,
    dateInitialized,
    initialLoad,
  } = useMealData();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      const formattedInitialDate = format(initialDate, "yyyy-MM-dd");
      queryClient.setQueryData(["mealData", formattedInitialDate], initialData);
    }
  }, [initialData, initialDate, queryClient]);

  const showContent = useMemo(() => dateInitialized || !initialLoad, [dateInitialized, initialLoad]);

  const backgroundOpacities = useMemo(
    () => ({
      lunch: initialLoad ? initialOpacity.lunch : lunchOpacity,
      dinner: initialLoad ? initialOpacity.dinner : dinnerOpacity,
    }),
    [initialLoad, initialOpacity, lunchOpacity, dinnerOpacity],
  );

  const formattedCurrentDate = useMemo(
    () => (dateInitialized ? format(currentDate, "M월 d일 eeee", { locale: ko }) : ""),
    [dateInitialized, currentDate],
  );

  const displayMeals = useMemo<Meal[]>(
    () =>
      MEAL_ORDER.map((base) => {
        const found = meals.find((meal) => meal.time === base.time);
        return found ?? { time: base.time, operatingHours: base.operatingHours, corners: [] };
      }),
    [meals],
  );

  const handleResetToToday = useCallback(() => {
    resetToToday();
    setMealByTime();
  }, [resetToToday, setMealByTime]);

  return (
    <div className="relative flex h-svh items-center justify-center overflow-hidden py-4 md:px-4 md:py-8">
      <MealBackgroundImages backgroundOpacities={backgroundOpacities} />
      <MealDesktopBackground />

      <div className="z-10 flex h-full max-h-[900px] w-full max-w-[1500px] flex-col-reverse gap-4 md:flex-col md:px-4">
        <MealNavigationBar
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onResetToToday={handleResetToToday}
          onRefresh={handleRefresh}
          formattedCurrentDate={formattedCurrentDate}
        />

        {isLoading && !initialLoad && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex w-full flex-1 snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-4 md:snap-none md:px-0">
          {displayMeals.map((meal) => (
            <MealSection
              key={meal.time}
              meal={meal}
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
              showContent={showContent}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default MealLayout;
