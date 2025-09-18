"use client"

import Image from 'next/image';
import { memo, useEffect } from 'react';
import type { MealSearchResponse } from '@/types';
import { X } from 'lucide-react';
import Glass from './Glass';

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: MealSearchResponse | null;
}

export const ImagePopup = memo(function ImagePopup({ isOpen, onClose, data }: ImagePopupProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getMealTypeKorean = (mealType: string) => {
    const mealMap: Record<string, string> = {
      breakfast: '조식',
      lunch: '중식',
      dinner: '석식',
      '아침': '조식',
      '점심': '중식',
      '저녁': '석식'
    };
    return mealMap[mealType.toLowerCase()] || mealMap[mealType] || mealType;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}년 ${month}월 ${day}일`;
    } catch {
      return dateString;
    }
  };

  const isTodayMealPhoto = data?.foodName === data?.mealType;

  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Glass
        className="max-w-lg w-full max-h-[80vh] overflow-y-auto bg-white bg-opacity-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {isTodayMealPhoto ? getMealTypeKorean(data.mealType) : data.foodName}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <Image
            src={data.image}
            alt={data.foodName}
            width={400}
            height={300}
            className="rounded-lg object-cover w-full"
            style={{ filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))' }}
          />
          {!isTodayMealPhoto && (
            <div className="text-center">
              <p className="text-lg font-bold text-white">
                {formatDate(data.date)}<br />{getMealTypeKorean(data.mealType)}으로 나왔던 메뉴예요
              </p>
            </div>
          )}
        </div>
      </Glass>
    </div>
  );
});