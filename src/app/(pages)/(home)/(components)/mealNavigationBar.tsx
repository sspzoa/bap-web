import Image from "next/image";
import { memo } from "react";
import { useLongPress } from "@/app/(pages)/(home)/(hooks)/useLongPress";
import Glass from "@/shared/components/common/glass";
import { SiteSelectButton } from "@/shared/components/siteSelectButton";

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
      <SiteSelectButton className="order-1" />

      <Glass
        className="order-2 flex h-[54px] min-w-0 flex-1 cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50"
        {...longPressProps}>
        <p className="font-bold text-xl tracking-tight md:text-[22px]">{formattedCurrentDate}</p>
      </Glass>

      <Glass
        className="order-3 flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50"
        onClick={onPrevDay}>
        <Image src="/icon/arrow-left.svg" alt="이전 날" width={32} height={32} draggable={false} />
      </Glass>

      <Glass
        className="order-4 flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50"
        onClick={onNextDay}>
        <Image src="/icon/arrow-right.svg" alt="다음 날" width={32} height={32} draggable={false} />
      </Glass>
    </div>
  );
});
