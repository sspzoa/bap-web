"use client"

import Image from 'next/image';
import { memo, useEffect } from 'react';
import type { MealSearchResponse } from '@/types';
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

  const getMealTypeKorean = (mealType: string) => {
    const mealMap: Record<string, string> = {
      breakfast: '아침',
      lunch: '점심',
      dinner: '저녁'
    };
    return mealMap[mealType.toLowerCase()] || mealType;
  };

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
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{data.foodName}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <Image
              src={data.image}
              alt={data.foodName}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full"
              style={{ filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))' }}
            />
          </div>

          <div className="text-center">
            <p className="font-bold text-white mb-2">
              {formatDate(data.date)} {getMealTypeKorean(data.mealType)}으로 나왔던 메뉴예요
            </p>
          </div>
        </div>
      </Glass>
    </div>
  );
});