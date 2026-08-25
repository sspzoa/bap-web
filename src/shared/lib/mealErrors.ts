export const MEAL_ERROR_MESSAGES = {
  noMealData: "식단 정보가 없어요",
  noMealOperation: "식단 운영이 없어요",
} as const;

export function resolveMealSectionMessage({
  isLoading,
  isError,
  errorMessage,
  isEmpty,
}: {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  isEmpty: boolean;
}): string | null {
  if (isLoading) {
    return null;
  }

  if (isError) {
    return errorMessage || MEAL_ERROR_MESSAGES.noMealData;
  }

  if (isEmpty) {
    return MEAL_ERROR_MESSAGES.noMealOperation;
  }

  return null;
}
