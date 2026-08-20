import { useQuery } from "@tanstack/react-query";
import { searchFoodImage } from "@/shared/lib/mealService";
import { foodImageQueryKey } from "@/shared/lib/queryKeys";
import { SITES } from "@/sites/config";
import { useSiteId } from "@/sites/context";

export const useFoodImageSearch = (foodName: string, enabled = true) => {
  const siteId = useSiteId();
  const apiPath = SITES[siteId].apiPath;

  return useQuery({
    queryKey: foodImageQueryKey(siteId, foodName),
    queryFn: () => searchFoodImage(apiPath, foodName),
    enabled: enabled && !!foodName,
    staleTime: 300000,
    retry: false,
  });
};
