import Image from "next/image";
import { memo } from "react";
import { useLongPress } from "@/app/(pages)/(home)/(hooks)/useLongPress";
import Glass from "@/shared/components/common/glass";

interface MealNavigationBarProps {
  onPrevDay: () => void;
  onNextDay: () => void;
  onResetToToday: () => void;
  onRefresh: () => void;
  formattedCurrentDate: string;
}

export const MealNavigationBar = memo(function MealNavigationBar({
  onPrevDay,
  onNextDay,
  onResetToToday,
  onRefresh,
  formattedCurrentDate,
}: MealNavigationBarProps) {
  const longPressProps = useLongPress({
    onLongPress: onRefresh,
    onClick: onResetToToday,
    threshold: 1000,
  });

  return (
    <div className="flex flex-row gap-4 px-4 md:px-0">
      <Glass
        className="order-1 flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50 md:order-2"
        onClick={onPrevDay}>
        <Image src="/icon/arrow-left.svg" alt="arrow-left" width={32} height={32} draggable={false} />
      </Glass>

      <Glass
        className="order-2 flex h-full w-full cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50 md:order-1"
        {...longPressProps}>
        <p className="font-bold text-xl tracking-tight md:text-[22px]">{formattedCurrentDate}</p>
      </Glass>

      <Glass
        className="order-3 flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50"
        onClick={onNextDay}>
        <Image src="/icon/arrow-right.svg" alt="arrow-right" width={32} height={32} draggable={false} />
      </Glass>
    </div>
  );
});
