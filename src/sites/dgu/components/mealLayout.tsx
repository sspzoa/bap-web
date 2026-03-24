"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { ko } from "date-fns/locale/ko";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo } from "react";
import { MealNavigationBar } from "@/app/(pages)/(home)/(components)/mealNavigationBar";
import { RestaurantSection } from "@/sites/dgu/components/restaurantSection";
import { useMealData } from "@/sites/dgu/hooks/useMealData";
import type { MealLayoutProps } from "@/sites/dgu/types";
import LoadingSpinner from "@/shared/components/common/loadingSpinner";

const PLACEHOLDER_RESTAURANTS = [
  { id: "1F", name: "1층", categories: [] },
  { id: "2F", name: "2층", categories: [] },
  { id: "3F", name: "3층", categories: [] },
];

const MealLayout = memo(function MealLayout({ initialData, initialDate }: MealLayoutProps) {
  const {
    currentDate,
    restaurants,
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

  const showContent = useMemo(() => {
    return dateInitialized || !initialLoad;
  }, [dateInitialized, initialLoad]);

  const formattedCurrentDate = useMemo(() => {
    return dateInitialized ? format(currentDate, "M월 d일 eeee", { locale: ko }) : "";
  }, [dateInitialized, currentDate]);

  const displayRestaurants = useMemo(
    () => (restaurants.length > 0 ? restaurants : PLACEHOLDER_RESTAURANTS),
    [restaurants],
  );

  const commonProps = useMemo(
    () => ({
      isLoading,
      isError,
      errorMessage,
      showContent,
    }),
    [isLoading, isError, errorMessage, showContent],
  );

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

        <div className="flex w-full flex-1 snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-4 md:snap-none md:px-0">
          {displayRestaurants.map((restaurant) => (
            <RestaurantSection key={restaurant.id} restaurant={restaurant} {...commonProps} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default MealLayout;
