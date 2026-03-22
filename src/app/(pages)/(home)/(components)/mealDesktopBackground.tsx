import Image from "next/image";
import { memo } from "react";

export const MealDesktopBackground = memo(function MealDesktopBackground() {
  return (
    <div className="fixed inset-0 hidden h-full w-full md:block">
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          opacity: 1,
          zIndex: 3,
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
