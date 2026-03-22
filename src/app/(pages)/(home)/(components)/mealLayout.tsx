"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { ko } from "date-fns/locale/ko";
import { memo, useCallback, useEffect, useMemo } from "react";
import { MealBackgroundImages } from "@/app/(pages)/(home)/(components)/mealBackgroundImages";
import { MealDesktopBackground } from "@/app/(pages)/(home)/(components)/mealDesktopBackground";
import { MealNavigationBar } from "@/app/(pages)/(home)/(components)/mealNavigationBar";
import { MealSection } from "@/app/(pages)/(home)/(components)/mealSection";
import { useMealData } from "@/app/(pages)/(home)/(hooks)/useMealData";
import LoadingSpinner from "@/shared/components/common/loadingSpinner";
import type { MealLayoutProps } from "@/shared/types/index";

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
      const formattedInitialDate = format(initialDate, "yyyy-MM-dd");
      queryClient.setQueryData(["mealData", formattedInitialDate], initialData);
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
    return dateInitialized ? format(currentDate, "M월 d일 eeee", { locale: ko }) : "";
  }, [dateInitialized, currentDate]);

  const mealSectionProps = useMemo(
    () => ({
      breakfast: {
        icon: "/icon/breakfast.svg",
        title: "아침",
        regularItems: data?.breakfast?.regular || [],
        simpleMealItems: data?.breakfast?.simple || [],
        plusItems: data?.breakfast?.plus || [],
        imageUrl: data?.breakfast?.image || "",
        id: "breakfast",
      },
      lunch: {
        icon: "/icon/lunch.svg",
        title: "점심",
        regularItems: data?.lunch?.regular || [],
        simpleMealItems: data?.lunch?.simple || [],
        plusItems: data?.lunch?.plus || [],
        imageUrl: data?.lunch?.image || "",
        id: "lunch",
      },
      dinner: {
        icon: "/icon/dinner.svg",
        title: "저녁",
        regularItems: data?.dinner?.regular || [],
        simpleMealItems: data?.dinner?.simple || [],
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
          <MealSection {...mealSectionProps.breakfast} {...commonMealProps} />

          <MealSection {...mealSectionProps.lunch} {...commonMealProps} />

          <MealSection {...mealSectionProps.dinner} {...commonMealProps} />
        </div>
      </div>
    </div>
  );
});

export default MealLayout;
