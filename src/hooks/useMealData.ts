import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, subDays, addDays } from "date-fns";
import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { MealData } from "@/types";
import { currentDateAtom } from "@/atom";

const fetchMealData = async (date: string): Promise<MealData> => {
  const response = await fetch(`https://api.xn--rh3b.net/${date}`);
  if (!response.ok) {
    throw new Error("Failed to fetch meal data");
  }
  return response.json();
};

export const useMealData = () => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [breakfastOpacity, setBreakfastOpacity] = useState(1);
  const [lunchOpacity, setLunchOpacity] = useState(0);
  const [dinnerOpacity, setDinnerOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [dateInitialized, setDateInitialized] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mealData", formattedDate],
    queryFn: () => fetchMealData(formattedDate),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    const prevDate = subDays(currentDate, 1);
    const prevFormattedDate = format(prevDate, "yyyy-MM-dd");
    queryClient.prefetchQuery({
      queryKey: ["mealData", prevFormattedDate],
      queryFn: () => fetchMealData(prevFormattedDate),
      staleTime: 1000 * 60 * 5,
      retry: false,
    });

    const nextDate = addDays(currentDate, 1);
    const nextFormattedDate = format(nextDate, "yyyy-MM-dd");
    queryClient.prefetchQuery({
      queryKey: ["mealData", nextFormattedDate],
      queryFn: () => fetchMealData(nextFormattedDate),
      staleTime: 1000 * 60 * 5,
      retry: false,
    });
  }, [currentDate, queryClient]);

  const handlePrevDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
    setDateInitialized(true);
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
    setDateInitialized(true);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
    setDateInitialized(true);
  };

  const setMealByTime = () => {
    if (!scrollContainerRef.current) return;

    const now = new Date();
    const currentHour = now.getHours();
    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth / 3;

    if (currentHour >= 20 || currentHour < 8) {
      if (currentHour >= 20) {
        const tomorrow = addDays(new Date(), 1);
        setCurrentDate(tomorrow);

        scrollContainer.scrollLeft = 0;
        setBreakfastOpacity(1);
        setLunchOpacity(0);
        setDinnerOpacity(0);

        const tomorrowFormatted = format(tomorrow, "yyyy-MM-dd");
        queryClient.prefetchQuery({
          queryKey: ["mealData", tomorrowFormatted],
          queryFn: () => fetchMealData(tomorrowFormatted),
          staleTime: 1000 * 60 * 5,
          retry: false,
        });
      } else {
        scrollContainer.scrollLeft = 0;
        setBreakfastOpacity(1);
        setLunchOpacity(0);
        setDinnerOpacity(0);
      }
    } else if (currentHour >= 14) {
      scrollContainer.scrollLeft = scrollWidth * 2;
      setBreakfastOpacity(0);
      setLunchOpacity(0);
      setDinnerOpacity(1);
    } else if (currentHour >= 8) {
      scrollContainer.scrollLeft = scrollWidth;
      setBreakfastOpacity(0);
      setLunchOpacity(1);
      setDinnerOpacity(0);
    }

    setDateInitialized(true);
  };

  useEffect(() => {
    const checkIfMobile = () => {
      const wasMobile = isMobile;
      const newIsMobile = window.innerWidth < 768;

      setIsMobile(newIsMobile);

      if (wasMobile !== newIsMobile) {
        if (!newIsMobile) {
          setBreakfastOpacity(0);
          setLunchOpacity(0);
          setDinnerOpacity(1);
        } else {
          setMealByTime();
        }
      }
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!initialLoad) return;

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        setMealByTime();
        setInitialLoad(false);
      }, 100);
    }
  }, [initialLoad]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    const scrollContainer = e.currentTarget;
    const scrollPosition = scrollContainer.scrollLeft;
    const totalWidth = scrollContainer.scrollWidth;
    const sectionWidth = totalWidth / 3;

    if (scrollPosition < sectionWidth) {
      const progress = scrollPosition / sectionWidth;
      setBreakfastOpacity(1 - progress);
      setLunchOpacity(progress);
      setDinnerOpacity(0);
    } else if (scrollPosition < sectionWidth * 2) {
      const progress = (scrollPosition - sectionWidth) / sectionWidth;
      setBreakfastOpacity(0);
      setLunchOpacity(1 - progress);
      setDinnerOpacity(progress);
    } else {
      setBreakfastOpacity(0);
      setLunchOpacity(0);
      setDinnerOpacity(1);
    }
  };

  return {
    currentDate,
    setCurrentDate,
    data,
    isLoading,
    isError,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    setMealByTime,
    scrollContainerRef,
    breakfastOpacity,
    lunchOpacity,
    dinnerOpacity,
    isMobile,
    handleScroll,
    dateInitialized,
    initialLoad
  };
}