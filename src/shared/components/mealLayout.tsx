"use client";

import { format } from "date-fns/format";
import { ko } from "date-fns/locale/ko";
import { memo, useCallback, useMemo } from "react";
import { MealAdBanner } from "@/shared/components/mealAdBanner";
import { MealBackgroundImages } from "@/shared/components/mealBackgroundImages";
import { MealPageShell } from "@/shared/components/mealPageShell";
import { MealSection } from "@/shared/components/mealSection";
import { useMealData } from "@/shared/hooks/useMealData";
import type { MealFetchResult, PublicDayMenu, PublicMeal } from "@/shared/types/index";
import { useSite } from "@/sites/context";

interface MealLayoutProps {
  initialData: MealFetchResult<PublicDayMenu> | null;
  initialFormattedDate: string;
  initialOpacities: Record<string, number>;
}

const MealLayout = memo(function MealLayout({ initialData, initialFormattedDate, initialOpacities }: MealLayoutProps) {
  const site = useSite();
  const {
    currentDate,
    meals,
    isLoading,
    isError,
    errorMessage,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    setMealByTime,
    scrollContainerRef,
    opacities,
    handleScroll,
    dateInitialized,
    initialLoad,
  } = useMealData(initialData, initialFormattedDate);

  const showContent = useMemo(() => dateInitialized || !initialLoad, [dateInitialized, initialLoad]);
  const backgroundOpacities = initialLoad ? initialOpacities : opacities;
  const formattedCurrentDate = useMemo(
    () => (dateInitialized ? format(currentDate, "M월 d일 eeee", { locale: ko }) : ""),
    [dateInitialized, currentDate],
  );

  const displayMeals = useMemo<PublicMeal[]>(() => {
    const mealsById = new Map(meals.map((meal) => [meal.id, meal]));
    return site.meals.map((slot) => {
      const found = mealsById.get(slot.id);
      return (
        found ?? {
          id: slot.id,
          title: slot.title,
          operatingHours: slot.operatingHours,
          kcal: null,
          image: null,
          groups: [],
        }
      );
    });
  }, [meals, site.meals]);

  const handleResetToToday = useCallback(() => {
    resetToToday();
    setMealByTime();
  }, [resetToToday, setMealByTime]);

  const trio = displayMeals.length === 3;
  const sections = displayMeals.map((meal, index) => {
    const slot = site.meals.find((item) => item.id === meal.id);
    return (
      <MealSection
        key={meal.id}
        meal={meal}
        icon={slot?.icon ?? "/icon/utensils.svg"}
        foodSearch={site.features.foodSearch}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        showContent={showContent}
        showMenuAd
        spanRows={trio && index === 0}
      />
    );
  });

  return (
    <MealPageShell
      background={<MealBackgroundImages slots={site.meals} opacities={backgroundOpacities} />}
      formattedCurrentDate={formattedCurrentDate}
      onPrevDay={handlePrevDay}
      onNextDay={handleNextDay}
      onResetToToday={handleResetToToday}
      isLoading={isLoading}
      initialLoad={initialLoad}
      scrollContainerRef={scrollContainerRef}
      onScroll={handleScroll}
      bottomAdSpan={trio ? "from-800-until-1200" : "from-800"}
      wideTrio={trio}>
      {trio ? (
        <div className="contents min-[1200px]:grid min-[1200px]:h-full min-[1200px]:min-h-0 min-[1200px]:w-full min-[1200px]:flex-1 min-[1200px]:grid-cols-3 min-[1200px]:grid-rows-[minmax(0,1fr)_auto] min-[1200px]:gap-4">
          {sections[0]}
          {sections[1]}
          {sections[2]}
          <MealAdBanner
            placement="desktop"
            flush
            desktopSpan="from-1200"
            className="min-[1200px]:col-span-2 min-[1200px]:col-start-2"
          />
        </div>
      ) : (
        sections
      )}
    </MealPageShell>
  );
});

export default MealLayout;
