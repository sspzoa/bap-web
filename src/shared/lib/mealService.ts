import type { MealResponse, MealSearchResponse } from "@/shared/types/index";
import { handleMealError, handleMealResponse } from "./mealServiceHelpers";

const API_BASE_URL = "https://api.xn--rh3b.net";

export const fetchMealData = async (date: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${date}`);
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const getMealDataServerSide = async (date: string): Promise<MealResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${date}`, {
      cache: "no-store",
    });
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const refreshMealData = async (date: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh/${date}`, {
      method: "POST",
    });
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const searchFoodImage = async (foodName: string): Promise<MealSearchResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(foodName)}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as MealSearchResponse;
  } catch {
    return null;
  }
};
