"use client";

import Image from "next/image";
import { memo, useEffect, useMemo, useState } from "react";
import Glass from "@/shared/components/common/glass";
import { ImagePopup } from "@/shared/components/imagePopup";
import { MealSectionStatusMessage } from "@/shared/components/mealSectionStatusMessage";
import { useFoodImageSearch } from "@/shared/hooks/useFoodImageSearch";
import { resolveMealSectionMessage } from "@/shared/lib/mealErrors";
import type { MealSearchResponse, PublicMeal, PublicMenuGroup } from "@/shared/types/index";

const FALLBACK_ICON = "/icon/utensils.svg";

interface MealSectionProps {
  meal: PublicMeal;
  icon: string;
  foodSearch: boolean;
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  showContent: boolean;
}

const MenuItems = memo(function MenuItems({
  items,
  foodSearch,
  onFoodClick,
}: {
  items: string[];
  foodSearch: boolean;
  onFoodClick: (foodName: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex flex-row gap-2">
          <p className="shrink-0 font-semibold text-[20px]">-</p>
          {foodSearch ? (
            <button
              className="text-left duration-100 active:scale-95 active:opacity-50"
              onClick={() => onFoodClick(item)}>
              <p className="break-words font-semibold text-[20px]">{item}</p>
            </button>
          ) : (
            <p className="break-words font-semibold text-[20px]">{item}</p>
          )}
        </div>
      ))}
    </div>
  );
});

const GroupBlock = memo(function GroupBlock({
  group,
  foodSearch,
  onFoodClick,
}: {
  group: PublicMenuGroup;
  foodSearch: boolean;
  onFoodClick: (foodName: string) => void;
}) {
  if (group.items.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2" data-id={group.id}>
      {(group.label || group.price) && (
        <div className="flex flex-row items-baseline gap-2">
          {group.label && <p className="break-words font-bold text-[15px] opacity-50">{group.label}</p>}
          {group.price && <p className="shrink-0 font-bold text-[15px] opacity-50">₩{group.price}</p>}
        </div>
      )}
      <MenuItems items={group.items} foodSearch={foodSearch} onFoodClick={onFoodClick} />
    </div>
  );
});

export const MealSection = memo(function MealSection({
  meal,
  icon,
  foodSearch,
  isLoading,
  isError = false,
  errorMessage,
  showContent,
}: MealSectionProps) {
  const [popupData, setPopupData] = useState<MealSearchResponse | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResult } = useFoodImageSearch(searchQuery, foodSearch && !!searchQuery);

  const visibleGroups = useMemo(() => meal.groups.filter((group) => group.items.length > 0), [meal.groups]);
  const isEmpty = visibleGroups.length === 0 && !meal.image;
  const statusMessage = resolveMealSectionMessage({
    isLoading,
    isError,
    errorMessage,
    isEmpty,
  });
  const headerMeta = meal.operatingHours ?? (meal.kcal && meal.kcal > 0 ? `${meal.kcal} kcal` : null);

  useEffect(() => {
    if (!foodSearch || !searchQuery) {
      return;
    }

    if (searchResult) {
      setPopupData(searchResult);
      setIsPopupOpen(true);
      setSearchQuery("");
      return;
    }

    if (searchResult === null) {
      window.open(
        `https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(searchQuery)}`,
        "_blank",
      );
      setSearchQuery("");
    }
  }, [foodSearch, searchQuery, searchResult]);

  const handleFoodClick = (foodName: string) => {
    setSearchQuery(foodName);
  };

  const handlePhotoClick = () => {
    if (!meal.image) {
      return;
    }

    setPopupData({
      foodName: meal.title,
      image: meal.image,
      date: new Date().toISOString().split("T")[0],
      mealType: meal.title,
    });
    setIsPopupOpen(true);
  };

  return (
    <>
      <Glass
        className="flex min-h-0 w-full flex-shrink-0 snap-center snap-always flex-col gap-4 p-4 md:flex-1"
        data-id={meal.id}>
        {showContent && (
          <>
            <div className="flex h-8 flex-row items-center gap-2">
              <Image
                src={icon || FALLBACK_ICON}
                alt={meal.title}
                width={32}
                height={32}
                style={{ filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))" }}
                draggable={false}
              />
              <p className="font-bold text-[32px] tracking-tight">{meal.title}</p>
              {headerMeta && <p className="ml-auto text-[16px] tracking-tight opacity-50">{headerMeta}</p>}
            </div>

            {!isLoading && !isError && meal.image && (
              <div className="flex flex-row gap-2">
                <p className="font-semibold text-[20px]">-</p>
                <button
                  onClick={handlePhotoClick}
                  className="text-left font-semibold text-[20px] underline duration-100 active:scale-95 active:opacity-50">
                  사진 보기
                </button>
              </div>
            )}

            {!isLoading && !isError && visibleGroups.length > 0 ? (
              <div className="flex flex-col gap-4">
                {visibleGroups.map((group) => (
                  <GroupBlock key={group.id} group={group} foodSearch={foodSearch} onFoodClick={handleFoodClick} />
                ))}
              </div>
            ) : (
              statusMessage && <MealSectionStatusMessage message={statusMessage} />
            )}
          </>
        )}
      </Glass>

      <ImagePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} data={popupData} />
    </>
  );
});
