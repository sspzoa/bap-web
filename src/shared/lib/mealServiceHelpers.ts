import type { MealResponse } from "@/shared/types/index";

export const handleMealResponse = async (response: Response): Promise<MealResponse> => {
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
    data: responseData.data,
    error: null,
    isError: false,
  };
};

export const handleMealError = (_error: unknown): MealResponse => {
  return {
    data: null,
    error: null,
    isError: true,
  };
};
