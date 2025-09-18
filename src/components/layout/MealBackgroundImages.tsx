import Image from 'next/image';
import { memo } from 'react';

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
    <div className="fixed inset-0 w-full h-full md:hidden">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: backgroundOpacities.breakfast,
          zIndex: 1,
        }}>
        <Image
          src="/img/breakfast.svg"
          alt="아침 배경"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: '50% 90%',
          }}
          priority
          draggable={false}
        />
      </div>

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: backgroundOpacities.lunch,
          zIndex: 2,
        }}>
        <Image
          src="/img/lunch.svg"
          alt="점심 배경"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: '50% 90%',
          }}
          priority
          draggable={false}
        />
      </div>

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: backgroundOpacities.dinner,
          zIndex: 3,
        }}>
        <Image
          src="/img/dinner.svg"
          alt="저녁 배경"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: '50% 90%',
          }}
          priority
          draggable={false}
        />
      </div>
    </div>
  );
});
