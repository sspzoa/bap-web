import { calculateOpacityFromScroll } from '@/utils/mealTimingUtils';
import { useCallback, useRef, useState } from 'react';

export const useScrollOpacity = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [breakfastOpacity, setBreakfastOpacity] = useState(1);
  const [lunchOpacity, setLunchOpacity] = useState(0);
  const [dinnerOpacity, setDinnerOpacity] = useState(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollContainer = e.currentTarget;
    const scrollPosition = scrollContainer.scrollLeft;
    const totalWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const visibleSections = 3;
    const adjustedTotalWidth = (totalWidth / (visibleSections - 1)) * visibleSections;

    if (Math.abs(scrollPosition - totalWidth) < 1) {
      setBreakfastOpacity(0);
      setLunchOpacity(0);
      setDinnerOpacity(1);
      return;
    }

    const { breakfast, lunch, dinner } = calculateOpacityFromScroll(scrollPosition, adjustedTotalWidth);

    setBreakfastOpacity(breakfast);
    setLunchOpacity(lunch);
    setDinnerOpacity(dinner);
  }, []);

  const setOpacity = useCallback((breakfast: number, lunch: number, dinner: number) => {
    setBreakfastOpacity(breakfast);
    setLunchOpacity(lunch);
    setDinnerOpacity(dinner);
  }, []);

  return {
    scrollContainerRef,
    breakfastOpacity,
    lunchOpacity,
    dinnerOpacity,
    handleScroll,
    setOpacity,
  };
};
