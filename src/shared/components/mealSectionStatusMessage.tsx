import { memo } from "react";

export const MealSectionStatusMessage = memo(function MealSectionStatusMessage({ message }: { message: string }) {
  return <p className="font-semibold text-[20px]">{message}</p>;
});
