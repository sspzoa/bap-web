import type { ReactNode, RefObject, UIEventHandler } from "react";
import { memo } from "react";
import { MealNavigationBar } from "@/app/(pages)/(home)/(components)/mealNavigationBar";
import LoadingSpinner from "@/shared/components/common/loadingSpinner";
import { MealDesktopBackground } from "@/shared/components/mealDesktopBackground";
import { SiteEdgePanel } from "@/shared/components/siteEdgePanel";
import { SiteSelectOverlay } from "@/shared/components/siteSelectOverlay";

interface MealPageShellProps {
  background: ReactNode;
  formattedCurrentDate: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onResetToToday: () => void;
  isLoading: boolean;
  initialLoad: boolean;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onScroll: UIEventHandler<HTMLDivElement>;
  children: ReactNode;
}

export const MealPageShell = memo(function MealPageShell({
  background,
  formattedCurrentDate,
  onPrevDay,
  onNextDay,
  onResetToToday,
  isLoading,
  initialLoad,
  scrollContainerRef,
  onScroll,
  children,
}: MealPageShellProps) {
  return (
    <div className="relative flex h-svh items-center justify-center overflow-hidden py-4 md:px-4 md:py-8">
      {background}
      <MealDesktopBackground />
      <SiteEdgePanel />
      <SiteSelectOverlay />

      <div className="z-10 flex h-full max-h-[900px] w-full max-w-[1500px] flex-col-reverse gap-4 md:flex-col md:px-4">
        <MealNavigationBar
          onPrevDay={onPrevDay}
          onNextDay={onNextDay}
          onResetToToday={onResetToToday}
          formattedCurrentDate={formattedCurrentDate}
        />

        {isLoading && !initialLoad && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={onScroll}
          className="flex w-full flex-1 snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-4 md:snap-none md:px-0">
          {children}
        </div>
      </div>
    </div>
  );
});
