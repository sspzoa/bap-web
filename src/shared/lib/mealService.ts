import type { MealResponse, MealSearchResponse } from "@/shared/types/index";
import { handleMealError, handleMealResponse } from "./mealServiceHelpers";

const API_BASE_URL = "https://api.xn--rh3b.net";
const API_KEY_STORAGE_KEY = "refresh_api_key";

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

export const fetchMealData = async (apiPath: string, date: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${apiPath}/${date}`);
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const getMealDataServerSide = async (apiPath: string, date: string): Promise<MealResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${apiPath}/${date}`, {
      cache: "no-store",
    });
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const refreshMealData = async (apiPath: string, date: string): Promise<MealResponse> => {
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
