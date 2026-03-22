import Image from "next/image";
import { memo } from "react";
import Glass from "@/shared/components/common/glass";

interface MealToggleButtonProps {
  simpleMealToggle: boolean;
  onToggle: () => void;
  className?: string;
}

export const MealToggleButton = memo(function MealToggleButton({
  simpleMealToggle,
  onToggle,
  className = "",
}: MealToggleButtonProps) {
  return (
    <Glass
      className={`flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center rounded-tl-none rounded-tr-[15px] rounded-br-none rounded-bl-[15px] duration-100 active:scale-95 active:opacity-50 md:rounded-[15px] ${
        simpleMealToggle ? "bg-opacity-80" : "bg-opacity-40"
      } ${className}`}
      onClick={onToggle}>
      <div className="relative h-6 w-6">
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            simpleMealToggle ? "opacity-100" : "opacity-0"
          }`}>
          <Image
            src="/icon/utensils.svg"
            alt="utensils"
            width={24}
            height={24}
            draggable={false}
            style={{ filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))" }}
          />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            simpleMealToggle ? "opacity-0" : "opacity-100"
          }`}>
          <Image
            src="/icon/apple.svg"
            alt="apple"
            width={24}
            height={24}
            draggable={false}
            style={{ filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))" }}
          />
        </div>
      </div>
    </Glass>
  );
});
