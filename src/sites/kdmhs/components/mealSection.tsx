import Image from "next/image";
import { memo, useEffect, useMemo, useState } from "react";
import { ImagePopup } from "@/sites/kdmhs/components/imagePopup";
import { useFoodImageSearch } from "@/sites/kdmhs/hooks/useFoodImageSearch";
import type { MealSectionProps } from "@/sites/kdmhs/types";
import Glass from "@/shared/components/common/glass";
import { ERROR_MESSAGES } from "@/shared/lib/constants";
import type { MealSearchResponse } from "@/shared/types/index";

export const MealSection = memo(function MealSection({
  icon,
  title,
  regularItems,
  simpleMealItems,
  plusItems,
  imageUrl,
  isLoading,
  isError = false,
  errorMessage,
  id,
  showContent,
}: MealSectionProps & {
  errorMessage?: string;
}) {
  const [popupData, setPopupData] = useState<MealSearchResponse | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: searchResult } = useFoodImageSearch(searchQuery, !!searchQuery);

  useEffect(() => {
    if (searchResult && searchQuery) {
      setPopupData(searchResult);
      setIsPopupOpen(true);
      setSearchQuery("");
    } else if (searchQuery && searchResult === null) {
      window.open(
        `https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(searchQuery)}`,
        "_blank",
      );
      setSearchQuery("");
    }
  }, [searchResult, searchQuery]);

  const handleFoodClick = (foodName: string) => {
    setSearchQuery(foodName);
  };

  const handlePhotoClick = () => {
    if (imageUrl) {
      setPopupData({
        foodName: `${title}`,
        image: imageUrl,
        date: new Date().toISOString().split("T")[0],
        mealType: title,
      });
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupData(null);
  };

  const isMealOperationEmpty = useMemo(() => {
    return regularItems.length === 0 && simpleMealItems.length === 0 && plusItems.length === 0;
  }, [regularItems, simpleMealItems, plusItems]);

  const renderFoodItem = (item: string, key: string) => (
    <div key={key} className="flex flex-row gap-2">
      <p className="font-semibold text-[20px]">-</p>
      <button className="text-left duration-100 active:scale-95 active:opacity-50" onClick={() => handleFoodClick(item)}>
        <p className="break-words font-semibold text-[20px]">{item}</p>
      </button>
    </div>
  );

  const renderSectionLabel = (label: string) => (
    <p className="mt-1 font-bold text-[15px] opacity-50">{label}</p>
  );

  const mealItemsContent = useMemo(() => {
    if (isLoading) {
      return <div className="flex flex-row gap-2" />;
    }

    if (isError) {
      return (
        <div className="flex flex-row gap-2">
          <p className="font-semibold text-[20px]">{errorMessage || ERROR_MESSAGES.kdmhs.NO_MEAL_DATA}</p>
        </div>
      );
    }

    if (!isMealOperationEmpty) {
      return (
        <>
          {regularItems.map((item, i) => renderFoodItem(item, `${title}-regular-${i}`))}
          {plusItems.length > 0 && (
            <>
              {renderSectionLabel("플러스바")}
              {plusItems.map((item, i) => renderFoodItem(item, `${title}-plus-${i}`))}
            </>
          )}
          {simpleMealItems.length > 0 && (
            <>
              {renderSectionLabel("간편식")}
              {simpleMealItems.map((item, i) => renderFoodItem(item, `${title}-simple-${i}`))}
            </>
          )}
        </>
      );
    }

    return (
      <div className="flex flex-row gap-2">
        <p className="font-semibold text-[20px]">{ERROR_MESSAGES.kdmhs.NO_MEAL_OPERATION}</p>
      </div>
    );
  }, [regularItems, simpleMealItems, plusItems, isLoading, isError, errorMessage, title, isMealOperationEmpty]);

  return (
    <>
      <Glass
        className="flex w-full flex-shrink-0 snap-center snap-always flex-col gap-4 overflow-y-auto p-4 md:flex-1"
        data-id={id}>
        {showContent && (
          <>
            <div className="flex h-8 flex-row items-center gap-2">
              <Image
                className="filter-drop-shadow"
                src={icon}
                alt={title}
                width={32}
                height={32}
                style={{ filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))" }}
                draggable={false}
              />
              <p className="font-bold text-[32px] tracking-tight">{title}</p>
            </div>

            <div className="flex flex-col gap-2">
              {!isLoading && imageUrl && !isError && (
                <div className="flex flex-row gap-2">
                  <p className="font-semibold text-[20px]">-</p>
                  <button
                    onClick={handlePhotoClick}
                    className="text-left font-semibold text-[20px] underline duration-100 active:scale-95 active:opacity-50">
                    사진 보기
                  </button>
                </div>
              )}

              {mealItemsContent}
            </div>
          </>
        )}
      </Glass>

      <ImagePopup isOpen={isPopupOpen} onClose={closePopup} data={popupData} />
    </>
  );
});
