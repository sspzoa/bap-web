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

export const parseMenu = (menuStr: string) => {
  return menuStr ? menuStr.split(/\/(?![^()]*\))/) : [];
};

export const getInitialMealState = () => {
  const currentTime = new Date().toTimeString().slice(0, 8);

  if (currentTime >= "19:30:00") {
    return {
      date: addDays(new Date(), 1),
      breakfastOpacity: 1,
      lunchOpacity: 0,
      dinnerOpacity: 0,
      scrollPosition: 0
    };
  } else if (currentTime >= "14:00:00") {
    return {
      date: new Date(),
      breakfastOpacity: 0,
      lunchOpacity: 0,
      dinnerOpacity: 1,
      scrollPosition: 2
    };
  } else if (currentTime >= "08:00:00") {
    return {
      date: new Date(),
      breakfastOpacity: 0,
      lunchOpacity: 1,
      dinnerOpacity: 0,
      scrollPosition: 1
    };
  } else {
    return {
      date: new Date(),
      breakfastOpacity: 1,
      lunchOpacity: 0,
      dinnerOpacity: 0,
      scrollPosition: 0
    };
  }
};

export const useMealData = (initialData?: MealData, initialDate?: Date) => {
  const initialState = getInitialMealState();

  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      setCurrentDate(initialState.date);
      initialRender.current = false;
    }
  }, [initialState.date, setCurrentDate]);

  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [breakfastOpacity, setBreakfastOpacity] = useState(initialState.breakfastOpacity);
  const [lunchOpacity, setLunchOpacity] = useState(initialState.lunchOpacity);
  const [dinnerOpacity, setDinnerOpacity] = useState(initialState.dinnerOpacity);
  const [isMobile, setIsMobile] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mealData", formattedDate],
    queryFn: () => fetchMealData(formattedDate),
    staleTime: 1000 * 60 * 5,
    retry: false,
    initialData: formattedDate === format(initialDate || initialState.date, "yyyy-MM-dd") ? initialData : undefined,
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
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    if (scrollContainerRef.current && isMobile) {
      const scrollContainer = scrollContainerRef.current;
      const scrollWidth = scrollContainer.scrollWidth / 3;
      scrollContainer.scrollLeft = scrollWidth * initialState.scrollPosition;
    }
  }, [isMobile, initialState.scrollPosition]);

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
        }
      }
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [isMobile]);

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
    scrollContainerRef,
    breakfastOpacity,
    lunchOpacity,
    dinnerOpacity,
    isMobile,
    handleScroll
  };
};