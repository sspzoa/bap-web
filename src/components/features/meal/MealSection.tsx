import { Glass, ImagePopup } from '@/components/ui';
import { ERROR_MESSAGES } from '@/constants';
import type { MealSectionProps, MealSearchResponse } from '@/types';
import { searchFoodImage } from '@/services/mealService';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo, useState } from 'react';
import { MealToggleButton } from "@/components/layout";

export const MealSection = memo(function MealSection({
  icon,
  title,
  regularItems,
  simpleMealItems,
  imageUrl,
  isLoading,
  isError = false,
  errorMessage,
  id,
  showContent,
  isSimpleMealMode = false,
  simpleMealToggle,
  onToggleSimpleMeal,
}: MealSectionProps & {
  errorMessage?: string;
  simpleMealToggle?: boolean;
  onToggleSimpleMeal?: () => void;
}) {
  const [popupData, setPopupData] = useState<MealSearchResponse | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleFoodClick = async (foodName: string) => {
    try {
      const result = await searchFoodImage(foodName);
      if (result) {
        setPopupData(result);
        setIsPopupOpen(true);
      } else {
        window.open(`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(foodName)}`, '_blank');
      }
    } catch (error) {
      console.error('Search failed:', error);
      window.open(`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${encodeURIComponent(foodName)}`, '_blank');
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupData(null);
  };
  const displayItems = useMemo(() => {
    return id === 'lunch' ? regularItems : isSimpleMealMode ? simpleMealItems : regularItems;
  }, [id, regularItems, simpleMealItems, isSimpleMealMode]);

  const isMealOperationEmpty = useMemo(() => {
    return (
      Array.isArray(regularItems) &&
      Array.isArray(simpleMealItems) &&
      regularItems.length === 0 &&
      simpleMealItems.length === 0
    );
  }, [regularItems, simpleMealItems]);

  const mealItemsContent = useMemo(() => {
    if (isLoading) {
      return <div className="flex flex-row gap-2" />;
    }

    if (isError) {
      return (
        <div className="flex flex-row gap-2">
          <p className="text-[20px] font-semibold">{errorMessage || ERROR_MESSAGES.NO_MEAL_DATA}</p>
        </div>
      );
    }

    if (displayItems.length > 0) {
      return displayItems.map((item, index) => (
        <div key={`${title.toLowerCase()}-${index}`} className="flex flex-row gap-2">
          <p className="text-[20px] font-semibold">-</p>
          <button
            className="active:scale-95 active:opacity-50 duration-100 text-left"
            onClick={() => handleFoodClick(item)}
          >
            <p className="text-[20px] font-semibold break-words">{item}</p>
          </button>
        </div>
      ));
    }

    if (isMealOperationEmpty) {
      return (
        <div className="flex flex-row gap-2">
          <p className="text-[20px] font-semibold">{ERROR_MESSAGES.NO_MEAL_OPERATION}</p>
        </div>
      );
    }

    if (isSimpleMealMode && id !== 'lunch') {
      return (
        <div className="flex flex-row gap-2">
          <p className="text-[20px] font-semibold">{ERROR_MESSAGES.NO_SIMPLE_MEAL}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-row gap-2">
        <p className="text-[20px] font-semibold">{ERROR_MESSAGES.NO_MEAL_DATA}</p>
      </div>
    );
  }, [displayItems, isLoading, isError, errorMessage, title, isMealOperationEmpty, isSimpleMealMode, id]);

  return (
    <>
      <Glass
        className="flex-shrink-0 w-full md:flex-1 snap-center snap-always p-4 flex flex-col gap-4 overflow-y-auto"
        data-id={id}>
        <div className="absolute top-0 right-0 z-10 md:hidden">
          <MealToggleButton simpleMealToggle={simpleMealToggle || false} onToggle={onToggleSimpleMeal || (() => {})} />
        </div>
        {showContent && (
          <>
            <div className="flex flex-row gap-2 items-center h-8">
              <Image
                className="filter-drop-shadow"
                src={icon}
                alt={title}
                width={32}
                height={32}
                style={{ filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))' }}
                draggable={false}
              />
              <p className="text-[32px] font-bold tracking-tight">{title}</p>
            </div>

            <div className="flex flex-col gap-2">
              {!isLoading && imageUrl && !isError && (
                <Link
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block active:scale-95 active:opacity-50 duration-100 self-center">
                  <img
                    src={imageUrl}
                    alt={`${title} 급식 사진`}
                    className="rounded-lg object-cover w-full scale-90"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))' }}
                    draggable={false}
                  />
                </Link>
              )}

              {mealItemsContent}
            </div>
          </>
        )}
      </Glass>

      <ImagePopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        data={popupData}
      />
    </>
  );
});
