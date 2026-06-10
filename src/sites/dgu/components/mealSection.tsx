import { memo } from "react";
import Glass from "@/shared/components/common/glass";
import { ERROR_MESSAGES } from "@/shared/lib/constants";
import type { MealSectionProps, MenuCorner } from "@/sites/dgu/types";

const CornerCard = memo(function CornerCard({ corner }: { corner: MenuCorner }) {
  return (
    <Glass
      className="flex w-[280px] flex-shrink-0 snap-center snap-always flex-col gap-3 overflow-y-auto p-4 md:w-auto md:flex-1"
      data-id={corner.name}>
      <div className="flex flex-row items-baseline justify-between gap-2">
        <p className="break-words font-bold text-[20px] tracking-tight">{corner.name}</p>
        {corner.price && <p className="shrink-0 font-bold text-[15px] opacity-50">₩{corner.price}</p>}
      </div>
      <div className="flex flex-col gap-2">
        {corner.items.map((item, i) => (
          <div key={`${item}-${i}`} className="flex flex-row gap-2">
            <p className="shrink-0 font-semibold text-[20px]">-</p>
            <p className="break-words font-semibold text-[20px]">{item}</p>
          </div>
        ))}
      </div>
    </Glass>
  );
});

export const MealSection = memo(function MealSection({ meal, isLoading, showContent }: MealSectionProps) {
  if (!showContent) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-baseline gap-2 px-1">
        <p className="font-bold text-[24px] tracking-tight">{meal.time}</p>
        {meal.operatingHours && <p className="font-bold text-[15px] opacity-50">{meal.operatingHours}</p>}
      </div>
      <div className="flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto md:snap-none">
        {meal.corners.length > 0 ? (
          meal.corners.map((corner) => <CornerCard key={corner.name} corner={corner} />)
        ) : (
          <Glass className="flex w-full flex-col gap-2 p-4">
            <p className="font-semibold text-[20px]">{isLoading ? "" : ERROR_MESSAGES.dgu.NO_MEAL_OPERATION}</p>
          </Glass>
        )}
      </div>
    </div>
  );
});
