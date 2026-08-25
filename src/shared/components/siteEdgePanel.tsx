import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
export const SiteEdgePanel = memo(function SiteEdgePanel() {
  return (
    <Link
      href="/select"
      aria-label="학교 선택"
      className="absolute top-1/2 right-0 z-30 flex h-[96px] w-[22px] -translate-y-1/2 items-center justify-center rounded-l-[14px] border-2 border-r-0 border-white/10 bg-white/20 shadow-[0_0_10px_rgba(0,0,0,0.05)] backdrop-blur-[24px] md:hidden">
      <LayoutGrid size={14} strokeWidth={2.5} />
    </Link>
  );
});
