import type { ReactNode, RefObject, UIEventHandler } from "react";
import { memo } from "react";
import { MealNavigationBar } from "@/app/(pages)/(home)/(components)/mealNavigationBar";
import LoadingSpinner from "@/shared/components/common/loadingSpinner";
import { MealAdBanner } from "@/shared/components/mealAdBanner";
import { MealDesktopBackground } from "@/shared/components/mealDesktopBackground";
import { SiteEdgePanel } from "@/shared/components/siteEdgePanel";
import type { DesktopAdSpan } from "@/shared/lib/adFit";

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
  /** Bottom desktop slot. Three-card layouts hide it once the ad sits under lunch and dinner. */
  bottomAdSpan?: DesktopAdSpan;
  /** Three meal cards: a 3-column grid from 1200px, where a 728px ad fits under two columns. */
  wideTrio?: boolean;
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
  bottomAdSpan = "from-800",
  wideTrio = false,
  children,
}: MealPageShellProps) {
  return (
    <div className="relative flex h-svh items-center justify-center overflow-hidden py-4 md:px-4 md:py-8">
      {background}
      <MealDesktopBackground />
      <SiteEdgePanel />

      <div className="relative z-10 flex h-full max-h-[900px] w-full max-w-[1500px] flex-col-reverse gap-4 md:flex-col md:px-4">
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
          className={`flex w-full flex-1 snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-4 md:snap-none md:px-0 ${
            wideTrio ? "min-[1200px]:overflow-hidden" : ""
          }`}>
          {children}
        </div>
        <MealAdBanner placement="desktop" flush desktopSpan={bottomAdSpan} />
      </div>
    </div>
  );
});
