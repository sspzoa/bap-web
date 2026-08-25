import { memo } from "react";
import { MealBackgroundLayer } from "@/shared/components/mealBackgroundLayer";
import type { MealSlotMeta } from "@/shared/types/index";

interface MealBackgroundImagesProps {
  slots: MealSlotMeta[];
  opacities: Record<string, number>;
}

export const MealBackgroundImages = memo(function MealBackgroundImages({
  slots,
  opacities,
}: MealBackgroundImagesProps) {
  return (
    <div className="fixed inset-0 h-full w-full md:hidden">
      {slots.map((slot, index) => (
        <MealBackgroundLayer
          key={slot.id}
          src={slot.background}
          alt=""
          opacity={opacities[slot.id] ?? 0}
          zIndex={index + 1}
        />
      ))}
    </div>
  );
});
