"use client";

import { format } from "date-fns/format";
import { ko } from "date-fns/locale/ko";
import { memo, useCallback, useMemo } from "react";
import { MealPageShell } from "@/shared/components/mealPageShell";
import { MealBackgroundImages } from "@/sites/dgu/components/mealBackgroundImages";
import { MealSection } from "@/sites/dgu/components/mealSection";
import { useMealData } from "@/sites/dgu/hooks/useMealData";
import type { Meal, MealLayoutProps } from "@/sites/dgu/types";

const MEAL_ORDER: { time: string; operatingHours: string }[] = [
  { time: "중식", operatingHours: "11:30~14:00" },
  { time: "석식", operatingHours: "17:00~19:00" },
];

const MealLayout = memo(function MealLayout({ initialData, initialOpacity }: MealLayoutProps) {
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
  } = useMealData(initialData);

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
    <MealPageShell
      background={<MealBackgroundImages backgroundOpacities={backgroundOpacities} />}
      formattedCurrentDate={formattedCurrentDate}
      onPrevDay={handlePrevDay}
      onNextDay={handleNextDay}
      onResetToToday={handleResetToToday}
      onRefresh={handleRefresh}
      isLoading={isLoading}
      initialLoad={initialLoad}
      scrollContainerRef={scrollContainerRef}
      onScroll={handleScroll}>
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
    </MealPageShell>
  );
});

export default MealLayout;
