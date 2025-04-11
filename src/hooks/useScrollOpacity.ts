import { calculateOpacityFromScroll } from '@/utils/mealTimingUtils';
import { useRef, useState } from 'react';

export const useScrollOpacity = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [breakfastOpacity, setBreakfastOpacity] = useState(1);
  const [lunchOpacity, setLunchOpacity] = useState(0);
  const [dinnerOpacity, setDinnerOpacity] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollContainer = e.currentTarget;
    const scrollPosition = scrollContainer.scrollLeft;
    const totalWidth = scrollContainer.scrollWidth;

    const { breakfast, lunch, dinner } = calculateOpacityFromScroll(scrollPosition, totalWidth);

    setBreakfastOpacity(breakfast);
    setLunchOpacity(lunch);
    setDinnerOpacity(dinner);
  };

  const setOpacity = (breakfast: number, lunch: number, dinner: number) => {
    setBreakfastOpacity(breakfast);
    setLunchOpacity(lunch);
    setDinnerOpacity(dinner);
  };

  return {
    scrollContainerRef,
    breakfastOpacity,
    lunchOpacity,
    dinnerOpacity,
    handleScroll,
    setOpacity,
  };
};
