"use client";

import { useCallback, useRef, useState } from "react";
import { calculateOpacityFromScroll } from "@/sites/dgu/utils/mealTimingUtils";

export const useScrollOpacity = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [lunchOpacity, setLunchOpacity] = useState(1);
  const [dinnerOpacity, setDinnerOpacity] = useState(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollContainer = e.currentTarget;
    const totalWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const { lunch, dinner } = calculateOpacityFromScroll(scrollContainer.scrollLeft, totalWidth);
    setLunchOpacity(lunch);
    setDinnerOpacity(dinner);
  }, []);

  const setOpacity = useCallback((lunch: number, dinner: number) => {
    setLunchOpacity(lunch);
    setDinnerOpacity(dinner);
  }, []);

  return {
    scrollContainerRef,
    lunchOpacity,
    dinnerOpacity,
    handleScroll,
    setOpacity,
  };
};
