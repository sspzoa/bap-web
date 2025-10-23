import { ERROR_MESSAGES } from '@/constants';
import type { MealResponse } from '@/types';

export const handleMealResponse = async (response: Response): Promise<MealResponse> => {
  if (!response.ok) {
    let errorMessage = ERROR_MESSAGES.NO_MEAL_DATA;

    try {
      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
    }

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

export const handleMealError = (error: unknown): MealResponse => {
  const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NO_MEAL_DATA;
  return {
    data: null,
    error: errorMessage,
    isError: true,
  };
};
