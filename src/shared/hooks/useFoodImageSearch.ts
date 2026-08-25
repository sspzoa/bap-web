import { useQuery } from "@tanstack/react-query";
import { searchFoodImage } from "@/shared/lib/mealService";
import { foodImageQueryKey } from "@/shared/lib/queryKeys";
import { useSite } from "@/sites/context";

export const useFoodImageSearch = (foodName: string, enabled = true) => {
  const site = useSite();

  return useQuery({
    queryKey: foodImageQueryKey(site.id, foodName),
    queryFn: () => searchFoodImage(site.basePath, foodName),
    enabled: enabled && !!foodName && site.features.foodSearch,
    staleTime: 300000,
    retry: false,
  });
};
