import { searchFoodImage } from '@/services/mealService';
import { useQuery } from '@tanstack/react-query';

export const useFoodImageSearch = (foodName: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['foodImage', foodName],
    queryFn: () => searchFoodImage(foodName),
    enabled: enabled && !!foodName,
    staleTime: 300000, // 5 minutes
    retry: false,
  });
};