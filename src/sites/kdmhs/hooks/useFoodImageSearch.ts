import { useQuery } from "@tanstack/react-query";
import { searchFoodImage } from "@/shared/lib/mealService";
import { foodImageQueryKey } from "@/shared/lib/queryKeys";
import { SITES } from "@/sites/config";

export const useFoodImageSearch = (foodName: string, enabled = true) => {
  const { id: siteId, apiPath } = SITES.kdmhs;

  return useQuery({
    queryKey: foodImageQueryKey(siteId, foodName),
    queryFn: () => searchFoodImage(apiPath, foodName),
    enabled: enabled && !!foodName,
    staleTime: 300000,
    retry: false,
  });
};
