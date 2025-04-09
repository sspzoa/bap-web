export interface MealData {
  breakfast: string;
  lunch: string;
  dinner: string;
  images: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface MealSectionProps {
  icon: string;
  title: string;
  items: string[];
  imageUrl: string;
  isLoading: boolean;
  isError?: boolean;
  id?: string; // ScrollMagic 타겟 요소 ID 추가
}