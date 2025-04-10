"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Glass from "@/components/Glass";
import { addHours, format, addDays, subDays } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { MealData, MealSectionProps } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpiner";

interface MealLayoutProps {
  initialData: MealData | null;
  initialDate: Date;
}

const parseMenu = (menuStr: string) => {
  return menuStr ? menuStr.split(/\/(?![^()]*\))/) : [];
};

const fetchMealData = async (date: string): Promise<MealData> => {
  const response = await fetch(`https://api.xn--rh3b.net/${date}`);
  if (!response.ok) {
    throw new Error("Failed to fetch meal data");
  }
  return response.json();
};

export default function MealLayout({ initialData, initialDate }: MealLayoutProps) {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const [simpleMealToggle, setSimpleMealToggle] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [breakfastOpacity, setBreakfastOpacity] = useState(1);
  const [lunchOpacity, setLunchOpacity] = useState(0);
  const [dinnerOpacity, setDinnerOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [dateInitialized, setDateInitialized] = useState(false);

  useEffect(() => {
    if (initialData) {
      const formattedInitialDate = format(initialDate, "yyyy-MM-dd");
      queryClient.setQueryData(["mealData", formattedInitialDate], initialData);
    }

    setDateInitialized(true);
  }, [initialData, initialDate, queryClient]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mealData", formattedDate],
    queryFn: () => fetchMealData(formattedDate),
    staleTime: 1000 * 60 * 5,
    retry: false,
    initialData: formattedDate === format(initialDate, "yyyy-MM-dd") ? initialData ?? undefined : undefined,
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
    const koreaTime = new Date(now.getTime() + (9 - (-now.getTimezoneOffset() / 60)) * 60 * 60 * 1000);
    const currentTime = koreaTime.toTimeString().slice(0, 8);
    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth / 3;

    if (currentTime >= "19:30:00" || currentTime < "08:00:00") {
      if (currentTime >= "19:30:00") {
        setCurrentDate(addDays(new Date(), 1));
      }
      scrollContainer.scrollLeft = 0;
      setBreakfastOpacity(1);
      setLunchOpacity(0);
      setDinnerOpacity(0);
    } else if (currentTime >= "14:00:00") {
      scrollContainer.scrollLeft = scrollWidth * 2;
      setBreakfastOpacity(0);
      setLunchOpacity(0);
      setDinnerOpacity(1);
    } else if (currentTime >= "08:00:00") {
      scrollContainer.scrollLeft = scrollWidth;
      setBreakfastOpacity(0);
      setLunchOpacity(1);
      setDinnerOpacity(0);
    } else {
      scrollContainer.scrollLeft = 0;
      setBreakfastOpacity(1);
      setLunchOpacity(0);
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

  const filterSimpleMeals = (items: string[], mealType: string) => {
    if (!simpleMealToggle) return items;

    const count = mealType === "아침" ? 5 : 3;
    const recentItems = items.slice(-count);

    const keywordList = ["샌드위치", "샐러드", "죽", "닭가슴살", "선식"];
    return recentItems.filter(item =>
      keywordList.some(keyword => item.includes(keyword))
    );
  };

  const breakfastItems = data ? parseMenu(data.breakfast) : [];
  const lunchItems = data ? parseMenu(data.lunch) : [];
  const dinnerItems = data ? parseMenu(data.dinner) : [];

  const filteredBreakfastItems = filterSimpleMeals(breakfastItems, "아침");
  const filteredDinnerItems = filterSimpleMeals(dinnerItems, "저녁");

  function getInitialOpacity() {
    const now = new Date();
    const koreaTime = addHours(now, 9 - (-now.getTimezoneOffset() / 60));
    const currentTime = koreaTime.toTimeString().slice(0, 8);

    if (currentTime >= "19:30:00" || currentTime < "08:00:00") {
      return { breakfast: 1, lunch: 0, dinner: 0 };
    } else if (currentTime >= "14:00:00") {
      return { breakfast: 0, lunch: 0, dinner: 1 };
    } else if (currentTime >= "08:00:00") {
      return { breakfast: 0, lunch: 1, dinner: 0 };
    } else {
      return { breakfast: 1, lunch: 0, dinner: 0 };
    }
  }

  const initialOpacity = getInitialOpacity();
  const showMealContent = dateInitialized || !initialLoad;

  return (
    <div className="h-[100dvh] flex items-center justify-center py-4 md:py-8 md:px-4 overflow-hidden relative">
      <div className="fixed inset-0 w-full h-full md:hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: initialLoad ? initialOpacity.breakfast : breakfastOpacity,
            zIndex: 1
          }}
        >
          <Image
            src="/img/breakfast.svg"
            alt="아침 배경"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: '50% 90%'
            }}
            priority
            draggable={false}
          />
        </div>

        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: initialLoad ? initialOpacity.lunch : lunchOpacity,
            zIndex: 2
          }}
        >
          <Image
            src="/img/lunch.svg"
            alt="점심 배경"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: '50% 90%'
            }}
            priority
            draggable={false}
          />
        </div>

        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: initialLoad ? initialOpacity.dinner : dinnerOpacity,
            zIndex: 3
          }}
        >
          <Image
            src="/img/dinner.svg"
            alt="저녁 배경"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: '50% 90%'
            }}
            priority
            draggable={false}
          />
        </div>
      </div>

      <div className="fixed inset-0 w-full h-full hidden md:block">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: 1,
            zIndex: 3
          }}
        >
          <Image
            src="/img/dinner.svg"
            alt="저녁 배경"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: '50% 90%'
            }}
            priority
            draggable={false}
          />
        </div>
      </div>

      <div className="fixed top-8 right-8 z-20 md:hidden">
        <Glass
          className={`active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer ${simpleMealToggle ? 'bg-opacity-80' : 'bg-opacity-40'}`}
          onClick={() => setSimpleMealToggle(!simpleMealToggle)}
        >
          <div className="relative w-6 h-6">
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${simpleMealToggle ? 'opacity-100' : 'opacity-0'}`}>
              <Image src="/icon/utensils.svg" alt="utensils" width={24} height={24} draggable={false}/>
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${simpleMealToggle ? 'opacity-0' : 'opacity-100'}`}>
              <Image src="/icon/apple.svg" alt="apple" width={24} height={24} draggable={false}/>
            </div>
          </div>
          <span className="absolute -bottom-6 text-xs font-medium">간편식</span>
        </Glass>
      </div>

      <div className="flex flex-col-reverse md:flex-col max-w-[1500px] md:px-4 w-full max-h-[900px] h-full gap-4 z-10">
        <div className="flex flex-row gap-4 px-4 md:px-0">
          <Glass
            className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] hidden md:flex justify-center items-center cursor-pointer order-0"
            onClick={() => setSimpleMealToggle(!simpleMealToggle)}
          >
            <div className="relative w-6 h-6">
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${simpleMealToggle ? 'opacity-100' : 'opacity-0'}`}>
                <Image src="/icon/utensils.svg" alt="utensils" width={24} height={24} draggable={false}/>
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${simpleMealToggle ? 'opacity-0' : 'opacity-100'}`}>
                <Image src="/icon/apple.svg" alt="apple" width={24} height={24} draggable={false}/>
              </div>
            </div>
            <span className="absolute -bottom-6 text-xs font-medium">간편식</span>
          </Glass>

          <Glass
            className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer order-1 md:order-2"
            onClick={handlePrevDay}
          >
            <Image src="/icon/arrow-left.svg" alt="arrow-left" width={32} height={32} draggable={false}/>
          </Glass>

          <Glass
            className="flex justify-center items-center w-full h-full cursor-pointer active:scale-95 active:opacity-50 duration-100 order-2 md:order-1"
            onClick={() => {
              resetToToday();
              setMealByTime();
            }}
          >
            <p className="text-xl md:text-[22px] font-extrabold tracking-tight">
              {dateInitialized ? format(currentDate, "M월 d일 eeee", {locale: ko}) : ""}
            </p>
          </Glass>

          <Glass
            className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer order-3 md:order-3"
            onClick={handleNextDay}
          >
            <Image src="/icon/arrow-right.svg" alt="arrow-right" width={32} height={32} draggable={false}/>
          </Glass>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
            <LoadingSpinner />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex flex-row gap-4 w-full flex-1 overflow-x-auto snap-x snap-mandatory md:snap-none px-4 md:px-0">
          <MealSection
            icon="/icon/breakfast.svg"
            title="아침"
            items={simpleMealToggle ? filteredBreakfastItems : breakfastItems}
            imageUrl={data?.images?.breakfast || ""}
            isLoading={isLoading}
            isError={isError}
            id="breakfast"
            showContent={showMealContent}
            isSimpleMealMode={simpleMealToggle}
          />

          <MealSection
            icon="/icon/lunch.svg"
            title="점심"
            items={lunchItems}
            imageUrl={data?.images?.lunch || ""}
            isLoading={isLoading}
            isError={isError}
            id="lunch"
            showContent={showMealContent}
            isSimpleMealMode={false}
          />

          <MealSection
            icon="/icon/dinner.svg"
            title="저녁"
            items={simpleMealToggle ? filteredDinnerItems : dinnerItems}
            imageUrl={data?.images?.dinner || ""}
            isLoading={isLoading}
            isError={isError}
            id="dinner"
            showContent={showMealContent}
            isSimpleMealMode={simpleMealToggle}
          />
        </div>
      </div>
    </div>
  );
}

function MealSection({
                       icon,
                       title,
                       items,
                       imageUrl,
                       isLoading,
                       isError = false,
                       id,
                       showContent,
                       isSimpleMealMode = false
                     }: MealSectionProps & {
  showContent: boolean;
  isSimpleMealMode?: boolean;
}) {
  return (
    <Glass
      className="flex-shrink-0 w-full md:flex-1 snap-center snap-always p-4 flex flex-col gap-4 overflow-y-auto"
      data-id={id}
    >
      {showContent && (
        <>
          <div className="flex flex-row gap-2 items-center h-8">
            <Image className="filter-drop-shadow" src={icon} alt={title} width={32} height={32} style={{filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))"}} draggable={false}/>
            <p className="text-[32px] font-extrabold tracking-tight">
              {title}
              {isSimpleMealMode && (
                <span className="text-sm font-medium ml-2">(간편식)</span>
              )}
            </p>
          </div>

          <div className="flex flex-col gap-2 pr-2">
            {!isLoading && imageUrl && !isError && (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-bold">-</p>
                <Link
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[20px] font-bold underline active:scale-95 active:opacity-50 duration-100"
                >
                  사진 보기
                </Link>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-row gap-2">
              </div>
            ) : isError ? (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-bold">-</p>
                <p className="text-[20px] font-bold">메뉴 정보가 없습니다</p>
              </div>
            ) : items.length > 0 ? (
              items.map((item, index) => (
                <div key={`${title.toLowerCase()}-${index}`} className="flex flex-row gap-2">
                  <p className="text-[20px] font-bold">-</p>
                  <Link className="active:scale-95 active:opacity-50 duration-100" rel="noreferrer noopener" href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${item}`}><p className="text-[20px] font-bold break-words">{item}</p></Link>
                </div>
              ))
            ) : isSimpleMealMode ? (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-bold">-</p>
                <p className="text-[20px] font-bold">간편식 메뉴가 없습니다</p>
              </div>
            ) : (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-bold">-</p>
                <p className="text-[20px] font-bold">메뉴 정보가 없습니다</p>
              </div>
            )}
          </div>
        </>
      )}
    </Glass>
  );
}