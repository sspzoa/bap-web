import { memo } from "react";
import { MealBackgroundLayer } from "@/shared/components/mealBackgroundLayer";

export const MealDesktopBackground = memo(function MealDesktopBackground({
  className = "fixed inset-0 hidden h-full w-full md:block",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <MealBackgroundLayer src="/img/dinner.svg" alt="" zIndex={3} />
    </div>
  );
});
