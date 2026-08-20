import Image from "next/image";
import { memo } from "react";

interface MealBackgroundLayerProps {
  src: string;
  alt: string;
  opacity?: number;
  zIndex?: number;
  className?: string;
}

export const MealBackgroundLayer = memo(function MealBackgroundLayer({
  src,
  alt,
  opacity = 1,
  zIndex,
  className = "absolute inset-0 h-full w-full",
}: MealBackgroundLayerProps) {
  return (
    <div className={className} style={{ opacity, zIndex }}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover", objectPosition: "50% 90%" }}
        priority
        draggable={false}
      />
    </div>
  );
});
