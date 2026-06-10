"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { ko } from "date-fns/locale/ko";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo } from "react";
import { MealNavigationBar } from "@/app/(pages)/(home)/(components)/mealNavigationBar";
import Glass from "@/shared/components/common/glass";
import LoadingSpinner from "@/shared/components/common/loadingSpinner";
import { MealSection } from "@/sites/dgu/components/mealSection";
import { useMealData } from "@/sites/dgu/hooks/useMealData";
import type { Meal, MealLayoutProps } from "@/sites/dgu/types";

const PLACEHOLDER_MEALS: Meal[] = [
  { time: "중식", operatingHours: "11:30~14:00", corners: [] },
  { time: "석식", operatingHours: "17:00~19:00", corners: [] },
];

const MealLayout = memo(function MealLayout({ initialData, initialDate }: MealLayoutProps) {
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

  const formattedCurrentDate = useMemo(
    () => (dateInitialized ? format(currentDate, "M월 d일 eeee", { locale: ko }) : ""),
    [dateInitialized, currentDate],
  );

  const displayMeals = useMemo(() => (meals.length > 0 ? meals : PLACEHOLDER_MEALS), [meals]);

  const handleResetToToday = useCallback(() => {
    resetToToday();
  }, [resetToToday]);

  return (
    <div className="relative flex h-svh items-center justify-center overflow-hidden py-4 md:px-4 md:py-8">
      <div className="fixed inset-0 h-full w-full">
        <Image
          src="/img/dinner.svg"
          alt="배경"
          fill
          style={{ objectFit: "cover", objectPosition: "50% 90%" }}
          priority
          draggable={false}
        />
      </div>

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

        <div className="flex w-full flex-1 flex-col gap-6 overflow-y-auto px-4 md:px-0">
          {showContent && isError ? (
            <Glass className="flex w-full flex-col gap-2 p-4">
              <p className="font-semibold text-[20px]">{errorMessage}</p>
            </Glass>
          ) : (
            displayMeals.map((meal) => (
              <MealSection key={meal.time} meal={meal} isLoading={isLoading} showContent={showContent} />
            ))
          )}
        </div>
      </div>
    </div>
  );
});

export default MealLayout;
