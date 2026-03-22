"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { memo, useEffect } from "react";
import Glass from "@/shared/components/common/glass";
import type { MealSearchResponse } from "@/shared/types/index";

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: MealSearchResponse | null;
}

export const ImagePopup = memo(function ImagePopup({ isOpen, onClose, data }: ImagePopupProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const getMealTypeKorean = (mealType: string) => {
    const mealMap: Record<string, string> = {
      breakfast: "조식",
      lunch: "중식",
      dinner: "석식",
      아침: "조식",
      점심: "중식",
      저녁: "석식",
    };
    return mealMap[mealType.toLowerCase()] || mealMap[mealType] || mealType;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "long" });
      return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
    } catch {
      return dateString;
    }
  };

  const isTodayMealPhoto = data?.foodName === data?.mealType;

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <Glass
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto bg-white bg-opacity-20"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-xl">
              {isTodayMealPhoto ? getMealTypeKorean(data.mealType) : data.foodName}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-white transition-colors hover:bg-white hover:bg-opacity-20 hover:text-gray-300">
              <X size={24} />
            </button>
          </div>
          <Image
            src={data.image}
            alt={data.foodName}
            width={400}
            height={300}
            className="w-full rounded-lg object-cover"
            style={{ filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))" }}
          />
          {!isTodayMealPhoto && (
            <div className="text-center">
              <p className="font-bold text-lg text-white">
                {formatDate(data.date)}에<br />
                {getMealTypeKorean(data.mealType)}으로 나왔던 메뉴예요
              </p>
            </div>
          )}
        </div>
      </Glass>
    </div>
  );
});
