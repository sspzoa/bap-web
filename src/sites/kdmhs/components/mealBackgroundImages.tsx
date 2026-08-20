import { memo } from "react";
import { MealBackgroundLayer } from "@/shared/components/mealBackgroundLayer";

interface MealBackgroundImagesProps {
  backgroundOpacities: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
}

export const MealBackgroundImages = memo(function MealBackgroundImages({
  backgroundOpacities,
}: MealBackgroundImagesProps) {
  return (
    <div className="fixed inset-0 h-full w-full md:hidden">
      <MealBackgroundLayer src="/img/breakfast.svg" alt="" opacity={backgroundOpacities.breakfast} zIndex={1} />
      <MealBackgroundLayer src="/img/lunch.svg" alt="" opacity={backgroundOpacities.lunch} zIndex={2} />
      <MealBackgroundLayer src="/img/dinner.svg" alt="" opacity={backgroundOpacities.dinner} zIndex={3} />
    </div>
  );
});
