'use client';

import Glass from '@/components/Glass';
import LoadingSpinner from '@/components/LoadingSpiner';
import { MealSection } from '@/components/MealSection';
import { CONFIG } from '@/config';
import { useMealData } from '@/hooks/useMealData';
import type { MealLayoutProps } from '@/types';
import { componentLogger } from '@/utils/logger';
import { getCurrentMealTiming } from '@/utils/mealTimingUtils';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';

const logger = componentLogger('MealLayout');

const BackgroundImage = memo(
  ({
    src,
    alt,
    opacity,
    zIndex,
  }: {
    src: string;
    alt: string;
    opacity: number;
    zIndex: number;
  }) => (
    <div className="absolute inset-0 w-full h-full" style={{ opacity, zIndex }}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: 'cover',
          objectPosition: '50% 90%',
        }}
        priority
        draggable={false}
      />
    </div>
  ),
);

BackgroundImage.displayName = 'BackgroundImage';

const NavigationButton = memo(
  ({
    onClick,
    icon,
    alt,
  }: {
    onClick: () => void;
    icon: string;
    alt: string;
  }) => (
    <Glass
      className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer"
      onClick={onClick}>
      <Image src={icon} alt={alt} width={32} height={32} draggable={false} />
    </Glass>
  ),
);

NavigationButton.displayName = 'NavigationButton';

const ToggleButton = memo(
  ({
    isActive,
    onClick,
  }: {
    isActive: boolean;
    onClick: () => void;
  }) => (
    <Glass
      className={`active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer ${
        isActive ? 'bg-opacity-80' : 'bg-opacity-40'
      }`}
      onClick={onClick}>
      <div className="relative w-6 h-6">
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}>
          <Image
            src="/icon/utensils.svg"
            alt="utensils"
            width={24}
            height={24}
            draggable={false}
            style={{ filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))' }}
          />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isActive ? 'opacity-0' : 'opacity-100'
          }`}>
          <Image
            src="/icon/apple.svg"
            alt="apple"
            width={24}
            height={24}
            draggable={false}
            style={{ filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))' }}
          />
        </div>
      </div>
    </Glass>
  ),
);

ToggleButton.displayName = 'ToggleButton';

export default function MealLayout({ initialData, initialDate }: MealLayoutProps) {
  const {
    currentDate,
    data,
    isLoading,
    isError,
    errorMessage,
    handlePrevDay,
    handleNextDay,
    resetToToday,
    setMealByTime,
    scrollContainerRef,
    breakfastOpacity,
    lunchOpacity,
    dinnerOpacity,
    handleScroll,
    dateInitialized,
    initialLoad,
  } = useMealData();

  const [simpleMealToggle, setSimpleMealToggle] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.SIMPLE_MEAL_TOGGLE);
      return saved === 'true';
    }
    return false;
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    logger.componentMount('MealLayout');
    const timer = logger.time('initial-render');

    return () => {
      timer();
      logger.componentUnmount('MealLayout');
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      const formattedInitialDate = format(initialDate, 'yyyy-MM-dd');
      queryClient.setQueryData(['mealData', formattedInitialDate], initialData);
      logger.debug('Initial data cached', { date: formattedInitialDate });
    }
  }, [initialData, initialDate, queryClient]);

  useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEYS.SIMPLE_MEAL_TOGGLE, String(simpleMealToggle));
    logger.action('toggleSimpleMeal', { enabled: simpleMealToggle });
  }, [simpleMealToggle]);

  const handleSimpleMealToggle = useCallback(() => {
    setSimpleMealToggle((prev) => !prev);
  }, []);

  const handleTodayClick = useCallback(() => {
    const timer = logger.time('resetToToday');
    resetToToday();
    setMealByTime();
    timer();
  }, [resetToToday, setMealByTime]);

  function getInitialOpacity() {
    const { opacity } = getCurrentMealTiming();
    return opacity;
  }

  const initialOpacity = getInitialOpacity();
  const showMealContent = dateInitialized || !initialLoad;

  const monitoredHandleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const timer = logger.time('scroll-handler');
      handleScroll(e);
      timer();
    },
    [handleScroll],
  );

  return (
    <div className="h-[100dvh] flex items-center justify-center py-4 md:py-8 md:px-4 overflow-hidden relative">
      {/* Mobile backgrounds */}
      <div className="fixed inset-0 w-full h-full md:hidden">
        <BackgroundImage
          src="/img/breakfast.svg"
          alt="아침 배경"
          opacity={initialLoad ? initialOpacity.breakfast : breakfastOpacity}
          zIndex={1}
        />
        <BackgroundImage
          src="/img/lunch.svg"
          alt="점심 배경"
          opacity={initialLoad ? initialOpacity.lunch : lunchOpacity}
          zIndex={2}
        />
        <BackgroundImage
          src="/img/dinner.svg"
          alt="저녁 배경"
          opacity={initialLoad ? initialOpacity.dinner : dinnerOpacity}
          zIndex={3}
        />
      </div>

      {/* Desktop background */}
      <div className="fixed inset-0 w-full h-full hidden md:block">
        <BackgroundImage src="/img/dinner.svg" alt="저녁 배경" opacity={1} zIndex={3} />
      </div>

      {/* Mobile toggle button */}
      <div className="fixed top-8 right-8 z-20 md:hidden">
        <ToggleButton isActive={simpleMealToggle} onClick={handleSimpleMealToggle} />
      </div>

      <div className="flex flex-col-reverse md:flex-col max-w-[1500px] md:px-4 w-full max-h-[900px] h-full gap-4 z-10">
        {/* Navigation bar */}
        <div className="flex flex-row gap-4 px-4 md:px-0">
          <div className="hidden md:block order-0">
            <ToggleButton isActive={simpleMealToggle} onClick={handleSimpleMealToggle} />
          </div>

          <Glass
            className="flex justify-center items-center w-full h-full cursor-pointer active:scale-95 active:opacity-50 duration-100 order-2 md:order-1"
            onClick={handleTodayClick}>
            <p className="text-xl md:text-[22px] font-bold tracking-tight">
              {dateInitialized ? format(currentDate, 'M월 d일 eeee', { locale: ko }) : ''}
            </p>
          </Glass>

          <div className="order-1 md:order-2">
            <NavigationButton onClick={handlePrevDay} icon="/icon/arrow-left.svg" alt="arrow-left" />
          </div>

          <div className="order-3">
            <NavigationButton onClick={handleNextDay} icon="/icon/arrow-right.svg" alt="arrow-right" />
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && !initialLoad && (
          <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
            <LoadingSpinner />
          </div>
        )}

        {/* Meal sections */}
        <div
          ref={scrollContainerRef}
          onScroll={monitoredHandleScroll}
          className="flex flex-row gap-4 w-full flex-1 overflow-x-auto snap-x snap-mandatory md:snap-none px-4 md:px-0">
          <MealSection
            icon="/icon/breakfast.svg"
            title="아침"
            regularItems={data?.breakfast?.regular || []}
            simpleMealItems={data?.breakfast?.simple || []}
            imageUrl={data?.breakfast?.image || ''}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
            id="breakfast"
            showContent={showMealContent}
            isSimpleMealMode={simpleMealToggle}
          />

          <MealSection
            icon="/icon/lunch.svg"
            title="점심"
            regularItems={data?.lunch?.regular || []}
            simpleMealItems={data?.lunch?.simple || []}
            imageUrl={data?.lunch?.image || ''}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
            id="lunch"
            showContent={showMealContent}
            isSimpleMealMode={simpleMealToggle}
          />

          <MealSection
            icon="/icon/dinner.svg"
            title="저녁"
            regularItems={data?.dinner?.regular || []}
            simpleMealItems={data?.dinner?.simple || []}
            imageUrl={data?.dinner?.image || ''}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
            id="dinner"
            showContent={showMealContent}
            isSimpleMealMode={simpleMealToggle}
          />
        </div>
      </div>
    </div>
  );
}
