"use client";

import { LayoutGrid } from "lucide-react";
import { memo } from "react";
import Glass from "@/shared/components/common/glass";
import { useSiteSelect } from "@/sites/context";

export const SiteSelectButton = memo(function SiteSelectButton({ className = "" }: { className?: string }) {
  const { openSelect } = useSiteSelect();

  return (
    <button type="button" onClick={openSelect} className={`shrink-0 ${className}`.trim()} aria-label="학교 선택">
      <Glass className="flex h-[54px] w-[54px] cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50">
        <LayoutGrid size={28} strokeWidth={2.5} />
      </Glass>
    </button>
  );
});
