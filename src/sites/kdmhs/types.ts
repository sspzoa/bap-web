import type { MealResponse } from "@/shared/types/index";

export interface MealItem {
  regular: string[];
  simple: string[];
  plus: string[];
  image: string;
}

export interface MealData {
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
}

export interface MealSectionProps {
  icon: string;
  title: string;
  regularItems: string[];
  simpleMealItems: string[];
  plusItems: string[];
  imageUrl: string;
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  id?: string;
  showContent: boolean;
}

export interface InitialOpacity {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface MealLayoutProps {
  initialData: MealResponse | null;
  initialDate: Date;
  initialOpacity: InitialOpacity;
}
