import Image from "next/image";
import { memo } from "react";
import Glass from "@/shared/components/common/glass";
import { ERROR_MESSAGES } from "@/shared/lib/constants";
import type { MealSectionProps, MenuCorner } from "@/sites/dgu/types";

const MEAL_ICONS: Record<string, string> = {
  중식: "/icon/lunch.svg",
  석식: "/icon/dinner.svg",
};

const MenuItems = memo(function MenuItems({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className="flex flex-row gap-2">
          <p className="shrink-0 font-semibold text-[20px]">-</p>
          <p className="break-words font-semibold text-[20px]">{item}</p>
        </div>
      ))}
    </div>
  );
});

const CornerBlock = memo(function CornerBlock({ corner }: { corner: MenuCorner }) {
  return (
    <div className="flex w-full flex-col gap-2" data-id={corner.name}>
      <div className="flex flex-row items-baseline gap-2">
        <p className="break-words font-bold text-[20px] tracking-tight">{corner.name}</p>
        {corner.price && <p className="shrink-0 font-bold text-[15px] opacity-50">₩{corner.price}</p>}
      </div>
      <MenuItems items={corner.items} />
    </div>
  );
});

export const MealSection = memo(function MealSection({
  meal,
  isLoading,
  isError = false,
  errorMessage,
  showContent,
}: MealSectionProps) {
  if (!showContent) return null;

  const showCorners = !isLoading && !isError && meal.corners.length > 0;
  const fallbackMessage = isError
    ? errorMessage || ERROR_MESSAGES.dgu.NO_MEAL_DATA
    : isLoading
      ? ""
      : ERROR_MESSAGES.dgu.NO_MEAL_OPERATION;

  // 끼니 카드 2개가 화면을 1:1로 나눠 가짐 — 모바일은 상하, 데스크톱은 좌우.
  // min-h-0 으로 카드가 내용보다 작게 줄어들 수 있게 해 내용이 넘치면 카드 내부에서 스크롤(Glass 기본 overflow-y-auto).
  return (
    <Glass className="flex min-h-0 w-full flex-1 flex-col gap-4 p-4" data-id={meal.time}>
      <div className="flex h-8 flex-row items-center gap-2">
        <Image
          src={MEAL_ICONS[meal.time] ?? "/icon/utensils.svg"}
          alt={meal.time}
          width={32}
          height={32}
          style={{ filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))" }}
          draggable={false}
        />
        <p className="font-bold text-[32px] tracking-tight">{meal.time}</p>
        {meal.operatingHours && <p className="ml-auto text-[16px] opacity-50 tracking-tight">{meal.operatingHours}</p>}
      </div>
      {showCorners ? (
        <div className="flex flex-col gap-4">
          {meal.corners.map((corner) => (
            <CornerBlock key={corner.name} corner={corner} />
          ))}
        </div>
      ) : (
        fallbackMessage && <p className="font-semibold text-[20px]">{fallbackMessage}</p>
      )}
    </Glass>
  );
});
