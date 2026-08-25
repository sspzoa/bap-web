import { API_BASE_URL } from "@/shared/lib/apiBase";
import type { MealFetchResult, MealSearchResponse } from "@/shared/types/index";

async function handleMealResponse<T>(response: Response): Promise<MealFetchResult<T>> {
  if (!response.ok) {
    let errorMessage: string | null = null;

    try {
      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {}

    return {
      data: null,
      error: errorMessage,
      isError: true,
    };
  }

  const responseData = await response.json();
  return {
    data: (responseData.data as T) ?? null,
    error: null,
    isError: false,
  };
}

function handleMealError(error: unknown): MealFetchResult<never> {
  return {
    data: null,
    error: error instanceof Error ? error.message : null,
    isError: true,
  };
}

export const fetchMealData = async <T>(apiPath: string, date: string): Promise<MealFetchResult<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${apiPath}/${date}`);
    return await handleMealResponse<T>(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const getMealDataServerSide = async <T>(apiPath: string, date: string): Promise<MealFetchResult<T> | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${apiPath}/${date}`, {
      cache: "no-store",
    });
    return await handleMealResponse<T>(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const searchFoodImage = async (apiPath: string, foodName: string): Promise<MealSearchResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${apiPath}/search/${encodeURIComponent(foodName)}`);
    if (!response.ok) {
      return null;
    }
    const body = await response.json();
    return {
      foodName: body.foodName,
      image: body.image,
      date: body.date,
      mealType: body.mealType,
      matchedMenu: body.matchedMenu,
      section: body.section,
    };
  } catch {
    return null;
  }
};
