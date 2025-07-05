'use client';

import Glass from '@/components/Glass';
import LoadingSpinner from '@/components/LoadingSpiner';
import { MealSection } from '@/components/MealSection';
import { useMealData } from '@/hooks/useMealData';
import type { MealLayoutProps } from '@/types';
import { getCurrentMealTiming } from '@/utils/mealTimingUtils';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MealLayout({ initialData, initialDate, initialOpacity }: MealLayoutProps) {
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

  const [simpleMealToggle, setSimpleMealToggle] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      const formattedInitialDate = format(initialDate, 'yyyy-MM-dd');
      queryClient.setQueryData(['mealData', formattedInitialDate], initialData);
    }
  }, [initialData, initialDate, queryClient]);

  const showMealContent = dateInitialized || !initialLoad;

  return (
    <div className="h-[100dvh] flex items-center justify-center py-4 md:py-8 md:px-4 overflow-hidden relative">
      <div className="fixed inset-0 w-full h-full md:hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: initialLoad ? initialOpacity.breakfast : breakfastOpacity,
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
            opacity: initialLoad ? initialOpacity.lunch : lunchOpacity,
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
            opacity: initialLoad ? initialOpacity.dinner : dinnerOpacity,
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

      <div className="fixed inset-0 w-full h-full hidden md:block">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: 1,
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

      <div className="fixed top-8 right-8 z-20 md:hidden">
        <Glass
          className={`active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer ${simpleMealToggle ? 'bg-opacity-80' : 'bg-opacity-40'}`}
          onClick={() => setSimpleMealToggle(!simpleMealToggle)}>
          <div className="relative w-6 h-6">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${simpleMealToggle ? 'opacity-100' : 'opacity-0'}`}>
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
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${simpleMealToggle ? 'opacity-0' : 'opacity-100'}`}>
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
      </div>

      <div className="flex flex-col-reverse md:flex-col max-w-[1500px] md:px-4 w-full max-h-[900px] h-full gap-4 z-10">
        <div className="flex flex-row gap-4 px-4 md:px-0">
          <Glass
            className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] hidden md:flex justify-center items-center cursor-pointer order-0"
            onClick={() => setSimpleMealToggle(!simpleMealToggle)}>
            <div className="relative w-6 h-6">
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${simpleMealToggle ? 'opacity-100' : 'opacity-0'}`}>
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
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${simpleMealToggle ? 'opacity-0' : 'opacity-100'}`}>
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

          <Glass
            className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer order-1 md:order-2"
            onClick={handlePrevDay}>
            <Image src="/icon/arrow-left.svg" alt="arrow-left" width={32} height={32} draggable={false} />
          </Glass>

          <Glass
            className="flex justify-center items-center w-full h-full cursor-pointer active:scale-95 active:opacity-50 duration-100 order-2 md:order-1"
            onClick={() => {
              resetToToday();
              setMealByTime();
            }}>
            <p className="text-xl md:text-[22px] font-bold tracking-tight">
              {dateInitialized ? format(currentDate, 'M월 d일 eeee', { locale: ko }) : ''}
            </p>
          </Glass>

          <Glass
            className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer order-3 md:order-3"
            onClick={handleNextDay}>
            <Image src="/icon/arrow-right.svg" alt="arrow-right" width={32} height={32} draggable={false} />
          </Glass>
        </div>

        {isLoading && !initialLoad && (
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
