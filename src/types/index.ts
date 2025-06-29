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

export interface ApiResponse {
  requestId: string;
  requestedDate: string;
  timestamp: string;
  data: MealData;
}

export interface ApiErrorResponse {
  requestId: string;
  timestamp: string;
  error: string;
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
  isSimpleMealMode?: boolean;
}

export interface MealLayoutProps {
  initialData: MealData | null;
  initialDate: Date;
}