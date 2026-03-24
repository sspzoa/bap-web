import { useQuery } from "@tanstack/react-query";
import { searchFoodImage } from "@/shared/lib/mealService";

export const useFoodImageSearch = (foodName: string, enabled = true) => {
  return useQuery({
    queryKey: ["foodImage", foodName],
    queryFn: () => searchFoodImage(foodName),
    enabled: enabled && !!foodName,
    staleTime: 300000,
    retry: false,
  });
};
