import type { MealResponse } from "@/shared/types/index";

export interface MenuItem {
  name: string;
  price: string | null;
}

export interface MealInfo {
  items: MenuItem[];
  price: string | null;
  operatingHours: string | null;
}

export interface Category {
  name: string;
  lunch: MealInfo | null;
  dinner: MealInfo | null;
}

export interface RestaurantMenu {
  id: string;
  name: string;
  categories: Category[];
}

export interface CafeteriaData {
  restaurants: RestaurantMenu[];
}

export interface RestaurantSectionProps {
  restaurant: RestaurantMenu;
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  showContent: boolean;
}

export interface MealLayoutProps {
  initialData: MealResponse | null;
  initialDate: Date;
}
