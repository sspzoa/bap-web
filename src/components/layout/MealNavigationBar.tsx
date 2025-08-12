import { Glass } from '@/components/ui';
import { useLongPress } from '@/hooks/ui';
import Image from 'next/image';
import { memo } from 'react';
import { MealToggleButton } from './MealToggleButton';

interface MealNavigationBarProps {
  simpleMealToggle: boolean;
  onToggleSimpleMeal: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onResetToToday: () => void;
  onRefresh: () => void;
  formattedCurrentDate: string;
}

export const MealNavigationBar = memo(function MealNavigationBar({
  simpleMealToggle,
  onToggleSimpleMeal,
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
      <MealToggleButton
        simpleMealToggle={simpleMealToggle}
        onToggle={onToggleSimpleMeal}
        className="hidden md:flex order-0"
      />

      <Glass
        className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer order-1 md:order-2"
        onClick={onPrevDay}>
        <Image src="/icon/arrow-left.svg" alt="arrow-left" width={32} height={32} draggable={false} />
      </Glass>

      <Glass
        className="flex justify-center items-center w-full h-full cursor-pointer active:scale-95 active:opacity-50 duration-100 order-2 md:order-1"
        {...longPressProps}>
        <p className="text-xl md:text-[22px] font-bold tracking-tight">{formattedCurrentDate}</p>
      </Glass>

      <Glass
        className="active:scale-95 active:opacity-50 duration-100 shrink-0 w-[54px] h-[54px] flex justify-center items-center cursor-pointer order-3 md:order-3"
        onClick={onNextDay}>
        <Image src="/icon/arrow-right.svg" alt="arrow-right" width={32} height={32} draggable={false} />
      </Glass>
    </div>
  );
});
