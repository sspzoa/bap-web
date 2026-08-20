"use client";

import { format } from "date-fns/format";
import { ko } from "date-fns/locale/ko";
import { memo, useCallback, useMemo } from "react";
import { MealPageShell } from "@/shared/components/mealPageShell";
import { MealBackgroundImages } from "@/sites/kdmhs/components/mealBackgroundImages";
import { MealSection } from "@/sites/kdmhs/components/mealSection";
import { useMealData } from "@/sites/kdmhs/hooks/useMealData";
import type { MealLayoutProps } from "@/sites/kdmhs/types";

const MealLayout = memo(function MealLayout({ initialData, initialOpacity }: MealLayoutProps) {
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
  } = useMealData(initialData);

  const showMealContent = useMemo(() => dateInitialized || !initialLoad, [dateInitialized, initialLoad]);

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
    return dateInitialized ? format(currentDate, "M월 d일 eeee", { locale: ko }) : "";
  }, [dateInitialized, currentDate]);

  const mealSectionProps = useMemo(
    () => ({
      breakfast: {
        icon: "/icon/breakfast.svg",
        title: "아침",
        regularItems: data?.breakfast?.regular || [],
        simpleMealItems: data?.breakfast?.simple || [],
        kcal: data?.breakfast?.kcal || 0,
        plusItems: data?.breakfast?.plus || [],
        imageUrl: data?.breakfast?.image || "",
        id: "breakfast",
      },
      lunch: {
        icon: "/icon/lunch.svg",
        title: "점심",
        regularItems: data?.lunch?.regular || [],
        simpleMealItems: data?.lunch?.simple || [],
        kcal: data?.lunch?.kcal || 0,
        plusItems: data?.lunch?.plus || [],
        imageUrl: data?.lunch?.image || "",
        id: "lunch",
      },
      dinner: {
        icon: "/icon/dinner.svg",
        title: "저녁",
        regularItems: data?.dinner?.regular || [],
        simpleMealItems: data?.dinner?.simple || [],
        kcal: data?.dinner?.kcal || 0,
        plusItems: data?.dinner?.plus || [],
        imageUrl: data?.dinner?.image || "",
        id: "dinner",
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
      <MealSection {...mealSectionProps.breakfast} {...commonMealProps} />
      <MealSection {...mealSectionProps.lunch} {...commonMealProps} />
      <MealSection {...mealSectionProps.dinner} {...commonMealProps} />
    </MealPageShell>
  );
});

export default MealLayout;
