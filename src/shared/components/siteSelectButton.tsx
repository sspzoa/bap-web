import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import Glass from "@/shared/components/common/glass";

export const SiteSelectButton = memo(function SiteSelectButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/select" className={`shrink-0 ${className}`.trim()} aria-label="학교 선택">
      <Glass className="flex h-[54px] w-[54px] cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50">
        <LayoutGrid size={28} strokeWidth={2.5} />
      </Glass>
    </Link>
  );
});
