import { ERROR_MESSAGES } from "@/shared/lib/constants";
import type { MealResponse } from "@/shared/types/index";

export const handleMealResponse = async (response: Response): Promise<MealResponse> => {
  if (!response.ok) {
    let errorMessage = ERROR_MESSAGES.NO_MEAL_DATA;

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
    data: responseData.data,
    error: null,
    isError: false,
  };
};

export const handleMealError = (_error: unknown): MealResponse => {
  return {
    data: null,
    error: ERROR_MESSAGES.NO_MEAL_DATA,
    isError: true,
  };
};
