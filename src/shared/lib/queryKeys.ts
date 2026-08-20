import type { QueryClient } from "@tanstack/react-query";
import { fetchMealData } from "@/shared/lib/mealService";
import type { SiteId } from "@/sites/config";

export const MEAL_QUERY_STALE_TIME = 300_000;

export function mealQueryKey(siteId: SiteId, date: string) {
  return ["mealData", siteId, date] as const;
}

export function foodImageQueryKey(siteId: SiteId, foodName: string) {
  return ["foodImage", siteId, foodName] as const;
}

export function mealQueryOptions<T>(siteId: SiteId, apiPath: string, date: string) {
  return {
    queryKey: mealQueryKey(siteId, date),
    queryFn: () => fetchMealData<T>(apiPath, date),
    staleTime: MEAL_QUERY_STALE_TIME,
    retry: false as const,
  };
}

export function prefetchMealDate<T>(queryClient: QueryClient, siteId: SiteId, apiPath: string, date: string) {
  return queryClient.prefetchQuery(mealQueryOptions<T>(siteId, apiPath, date));
}
