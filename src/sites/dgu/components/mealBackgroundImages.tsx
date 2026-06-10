import Image from "next/image";
import { memo } from "react";

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
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          opacity: backgroundOpacities.lunch,
          zIndex: 1,
        }}>
        <Image
          src="/img/lunch.svg"
          alt="점심 배경"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "50% 90%",
          }}
          priority
          draggable={false}
        />
      </div>

      <div
        className="absolute inset-0 h-full w-full"
        style={{
          opacity: backgroundOpacities.dinner,
          zIndex: 2,
        }}>
        <Image
          src="/img/dinner.svg"
          alt="저녁 배경"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "50% 90%",
          }}
          priority
          draggable={false}
        />
      </div>
    </div>
  );
});
