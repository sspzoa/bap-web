import { memo } from "react";
import { MealBackgroundLayer } from "@/shared/components/mealBackgroundLayer";

interface MealBackgroundImagesProps {
  backgroundOpacities: {
    lunch: number;
    dinner: number;
  };
}

export const MealBackgroundImages = memo(function MealBackgroundImages({
  backgroundOpacities,
}: MealBackgroundImagesProps) {
  return (
    <div className="fixed inset-0 h-full w-full md:hidden">
      <MealBackgroundLayer src="/img/lunch.svg" alt="" opacity={backgroundOpacities.lunch} zIndex={1} />
      <MealBackgroundLayer src="/img/dinner.svg" alt="" opacity={backgroundOpacities.dinner} zIndex={2} />
    </div>
  );
});
