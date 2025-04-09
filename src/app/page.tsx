"use client";

import Image from "next/image";
import Glass from "@/components/Glass";
import {format} from "date-fns";
import {ko} from "date-fns/locale";
import {parseMenu, useMealData} from "@/hooks/useMealData";
import {MealSectionProps} from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    currentDate,
    data,
    isLoading,
    isError,
    handlePrevDay,
    handleNextDay,
    scrollContainerRef,
    breakfastOpacity,
    lunchOpacity,
    dinnerOpacity,
    isMobile,
    handleScroll,
    dateInitialized,
    initialLoad
  } = useMealData();

  const breakfastItems = data ? parseMenu(data.breakfast) : [];
  const lunchItems = data ? parseMenu(data.lunch) : [];
  const dinnerItems = data ? parseMenu(data.dinner) : [];

  function getInitialOpacity() {
    const currentTime = new Date().toTimeString().slice(0, 8);

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

  return (
    <div className="h-[100dvh] flex items-center justify-center py-4 md:py-8 md:px-8 overflow-hidden relative">
      <div className="fixed inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isMobile
              ? (initialLoad ? initialOpacity.breakfast : breakfastOpacity)
              : initialOpacity.breakfast,
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
          />
        </div>

        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isMobile
              ? (initialLoad ? initialOpacity.lunch : lunchOpacity)
              : initialOpacity.lunch,
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
          />
        </div>

        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isMobile
              ? (initialLoad ? initialOpacity.dinner : dinnerOpacity)
              : initialOpacity.dinner,
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
          />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-col max-w-[1500px] w-full max-h-[900px] h-full gap-4 z-10">
        <div className="flex flex-row gap-4 px-4 md:px-0">
          <Glass
            className="active:scale-105 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer order-1 md:order-2"
            onClick={handlePrevDay}
          >
            <Image src="/icon/arrow-left.svg" alt="arrow-left" width={32} height={32}/>
          </Glass>

          <Glass className="flex justify-center items-center w-full order-2 md:order-1">
            <p className="text-xl md:text-[22px] font-extrabold tracking-tight">
              {dateInitialized ? format(currentDate, "M월 d일 eeee", {locale: ko}) : ""}
            </p>
          </Glass>

          <Glass
            className="active:scale-105 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer order-3 md:order-3"
            onClick={handleNextDay}
          >
            <Image src="/icon/arrow-right.svg" alt="arrow-right" width={32} height={32}/>
          </Glass>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex flex-row gap-4 w-full flex-1 overflow-x-auto snap-x snap-mandatory md:snap-none px-4 md:px-0">
          <MealSection
            icon="/icon/breakfast.svg"
            title="아침"
            items={breakfastItems}
            imageUrl={data?.images?.breakfast || ""}
            isLoading={isLoading}
            isError={isError}
            id="breakfast"
          />

          <MealSection
            icon="/icon/lunch.svg"
            title="점심"
            items={lunchItems}
            imageUrl={data?.images?.lunch || ""}
            isLoading={isLoading}
            isError={isError}
            id="lunch"
          />

          <MealSection
            icon="/icon/dinner.svg"
            title="저녁"
            items={dinnerItems}
            imageUrl={data?.images?.dinner || ""}
            isLoading={isLoading}
            isError={isError}
            id="dinner"
          />
        </div>
      </div>
    </div>
  );
}

function MealSection({icon, title, items, imageUrl, isLoading, isError = false, id}: MealSectionProps) {
  return (
    <Glass
      className="flex-shrink-0 w-full md:flex-1 snap-center snap-always p-4 flex flex-col gap-4 overflow-y-auto"
      data-id={id}
    >
      <div className="flex flex-row gap-2 items-center h-8">
        <Image src={icon} alt={title} width={32} height={32}/>
        <p className="text-[32px] font-extrabold tracking-tight">{title}</p>
      </div>

      <div className="flex flex-col gap-2 pr-2">
        {!isLoading && imageUrl && !isError && (
          <div className="flex flex-row gap-2">
            <p className="text-[20px] font-bold">-</p>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[20px] font-bold underline active:opacity-50 duration-100"
            >
              사진 보기
            </a>
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
              <p className="text-[20px] font-bold break-words">{item}</p>
            </div>
          ))
        ) : (
          <div className="flex flex-row gap-2">
            <p className="text-[20px] font-bold">-</p>
            <p className="text-[20px] font-bold">메뉴 정보가 없습니다</p>
          </div>
        )}
      </div>
    </Glass>
  );
}