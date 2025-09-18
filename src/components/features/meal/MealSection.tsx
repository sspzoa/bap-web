import { Glass, ImagePopup } from '@/components/ui';
import { ERROR_MESSAGES } from '@/constants';
import type { MealSectionProps, MealSearchResponse } from '@/types';
import { searchFoodImage } from '@/services/mealService';
import Image from 'next/image';
import { memo, useMemo, useState } from 'react';

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
}: MealSectionProps & {
  errorMessage?: string;
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

  const handlePhotoClick = () => {
    if (imageUrl) {
      setPopupData({
        foodName: `${title}`,
        image: imageUrl,
        date: new Date().toISOString().split('T')[0],
        mealType: title
      });
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupData(null);
  };
  const allItems = useMemo(() => {
    return [...regularItems, ...simpleMealItems];
  }, [regularItems, simpleMealItems]);

  const isMealOperationEmpty = useMemo(() => {
    return allItems.length === 0;
  }, [allItems]);

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

    if (allItems.length > 0) {
      return allItems.map((item, index) => {
        const isSimpleItem = index >= regularItems.length;
        const displayItem = isSimpleItem ? `<간편식>${item}` : item;
        return (
          <div key={`${title.toLowerCase()}-${index}`} className="flex flex-row gap-2">
            <p className="text-[20px] font-semibold">-</p>
            <button
              className="active:scale-95 active:opacity-50 duration-100 text-left"
              onClick={() => handleFoodClick(item)}
            >
              <p className="text-[20px] font-semibold break-words">{displayItem}</p>
            </button>
          </div>
        );
      });
    }

    if (isMealOperationEmpty) {
      return (
        <div className="flex flex-row gap-2">
          <p className="text-[20px] font-semibold">{ERROR_MESSAGES.NO_MEAL_OPERATION}</p>
        </div>
      );
    }


    return (
      <div className="flex flex-row gap-2">
        <p className="text-[20px] font-semibold">{ERROR_MESSAGES.NO_MEAL_DATA}</p>
      </div>
    );
  }, [allItems, regularItems.length, isLoading, isError, errorMessage, title, isMealOperationEmpty]);

  return (
    <>
      <Glass
        className="flex-shrink-0 w-full md:flex-1 snap-center snap-always p-4 flex flex-col gap-4 overflow-y-auto"
        data-id={id}>
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
                <div className="flex flex-row gap-2">
                  <p className="text-[20px] font-semibold">-</p>
                  <button
                    onClick={handlePhotoClick}
                    className="text-[20px] font-semibold underline active:scale-95 active:opacity-50 duration-100 text-left">
                    사진 보기
                  </button>
                </div>
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
