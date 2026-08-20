import type { MealFetchResult, MealSearchResponse } from "@/shared/types/index";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.xn--rh3b.net";
const API_KEY_STORAGE_KEY = "refresh_api_key";

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

const getRefreshApiKey = (): string | null => {
  const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedApiKey) {
    return storedApiKey;
  }

  const promptedApiKey = prompt("API KEY");
  if (!promptedApiKey) {
    return null;
  }

  localStorage.setItem(API_KEY_STORAGE_KEY, promptedApiKey);
  return promptedApiKey;
};

const requestMealRefresh = async (apiPath: string, date: string, apiKey: string): Promise<Response> => {
  return fetch(`${API_BASE_URL}${apiPath}/refresh/${date}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
};

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

export const refreshMealData = async <T>(apiPath: string, date: string): Promise<MealFetchResult<T>> => {
  const apiKey = getRefreshApiKey();
  if (!apiKey) {
    return handleMealError(new Error("API KEY is required."));
  }

  try {
    let response = await requestMealRefresh(apiPath, date, apiKey);

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem(API_KEY_STORAGE_KEY);

      const newApiKey = getRefreshApiKey();
      if (!newApiKey) {
        return handleMealError(new Error("API KEY is required."));
      }

      response = await requestMealRefresh(apiPath, date, newApiKey);
    }

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
