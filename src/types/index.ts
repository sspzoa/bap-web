export interface MealItem {
  regular: string[];
  simple: string[];
  image: string;
}

export interface MealData {
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
}

export interface MealResponse {
  data: MealData | null;
  error: string | null;
  isError: boolean;
}

export interface MealSearchResponse {
  foodName: string;
  image: string;
  date: string;
  mealType: string;
}

export interface MealSectionProps {
  icon: string;
  title: string;
  regularItems: string[];
  simpleMealItems: string[];
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
