import type { MealResponse } from "@/shared/types/index";

export interface MenuCorner {
  name: string;
  price: string | null;
  items: string[];
}

export interface Meal {
  time: string;
  operatingHours: string | null;
  corners: MenuCorner[];
}

export interface DayMenu {
  meals: Meal[];
}

export interface MealSectionProps {
  meal: Meal;
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  showContent: boolean;
}

export interface InitialOpacity {
  lunch: number;
  dinner: number;
}

export interface MealLayoutProps {
  initialData: MealResponse | null;
  initialDate: Date;
  initialOpacity: InitialOpacity;
}
