export interface MealFetchResult<T = unknown> {
  data: T | null;
  error: string | null;
  isError: boolean;
}

export interface MealSearchResponse {
  foodName: string;
  image: string;
  date: string;
  mealType: string;
  matchedMenu?: string;
  section?: "regular" | "simple" | "plus";
}
