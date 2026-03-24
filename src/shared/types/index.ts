export interface MealResponse {
  data: unknown;
  error: string | null;
  isError: boolean;
}

export interface MealSearchResponse {
  foodName: string;
  image: string;
  date: string;
  mealType: string;
}
