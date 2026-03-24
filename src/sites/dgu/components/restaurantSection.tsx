import { memo, useMemo } from "react";
import Glass from "@/shared/components/common/glass";
import { ERROR_MESSAGES } from "@/shared/lib/constants";
import type { Category, MealInfo, RestaurantSectionProps } from "@/sites/dgu/types";

const MealInfoBlock = memo(function MealInfoBlock({ info, label }: { info: MealInfo; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="mt-1 font-bold text-[15px] opacity-50">{label}</p>}
      {info.operatingHours && <p className="font-bold text-[15px] opacity-50">{info.operatingHours}</p>}
      <div className="flex flex-col gap-2">
        {info.items.map((item, i) => (
          <div key={`${item.name}-${i}`} className="flex flex-row items-baseline justify-between gap-2">
            <div className="flex min-w-0 flex-row gap-2">
              <p className="shrink-0 font-semibold text-[20px]">-</p>
              <p className="break-words font-semibold text-[20px]">{item.name}</p>
            </div>
            {item.price && <p className="shrink-0 font-bold text-[15px] opacity-50">{item.price}원</p>}
          </div>
        ))}
      </div>
      {info.price && <p className="mt-1 font-bold text-[15px] opacity-50">₩{info.price}</p>}
    </div>
  );
});

const CategoryBlock = memo(function CategoryBlock({
  category,
  hasDinnerInRestaurant,
}: {
  category: Category;
  hasDinnerInRestaurant: boolean;
}) {
  const { lunch, dinner } = category;
  if (!lunch && !dinner) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
      <p className="font-bold text-[15px] opacity-50">{category.name}</p>
      {hasDinnerInRestaurant ? (
        <div className="flex flex-col gap-3">
          {lunch ? (
            <MealInfoBlock info={lunch} label="중식" />
          ) : (
            <p className="font-bold text-[15px] opacity-50">중식 없음</p>
          )}
          {dinner ? (
            <MealInfoBlock info={dinner} label="석식" />
          ) : (
            <p className="font-bold text-[15px] opacity-50">석식 없음</p>
          )}
        </div>
      ) : (
        lunch && <MealInfoBlock info={lunch} />
      )}
    </div>
  );
});

export const RestaurantSection = memo(function RestaurantSection({
  restaurant,
  isLoading,
  isError = false,
  errorMessage,
  showContent,
}: RestaurantSectionProps) {
  const hasDinner = useMemo(
    () => restaurant.categories.some((c) => c.dinner !== null),
    [restaurant.categories],
  );

  const visibleCategories = useMemo(
    () => restaurant.categories.filter((c) => c.lunch !== null || c.dinner !== null),
    [restaurant.categories],
  );

  const content = useMemo(() => {
    if (isLoading) {
      return <div className="flex flex-row gap-2" />;
    }

    if (isError) {
      return (
        <div className="flex flex-row gap-2">
          <p className="font-semibold text-[20px]">{errorMessage || ERROR_MESSAGES.dgu.NO_MEAL_DATA}</p>
        </div>
      );
    }

    if (visibleCategories.length === 0) {
      return (
        <div className="flex flex-row gap-2">
          <p className="font-semibold text-[20px]">{ERROR_MESSAGES.dgu.NO_MEAL_OPERATION}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {visibleCategories.map((category) => (
          <CategoryBlock key={category.name} category={category} hasDinnerInRestaurant={hasDinner} />
        ))}
      </div>
    );
  }, [isLoading, isError, errorMessage, visibleCategories, hasDinner]);

  return (
    <Glass
      className="flex w-full flex-shrink-0 snap-center snap-always flex-col gap-4 overflow-y-auto p-4 md:flex-1"
      data-id={restaurant.id}>
      {showContent && (
        <>
          <div className="flex h-8 flex-row items-center gap-2">
            <p className="font-bold text-[32px] tracking-tight">{restaurant.name}</p>
          </div>
          <div className="flex flex-col gap-2">{content}</div>
        </>
      )}
    </Glass>
  );
});
