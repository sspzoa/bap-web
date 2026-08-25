import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import Glass from "@/shared/components/common/glass";
import { BRAND } from "@/sites/config";

export const SiteSelectButton = memo(function SiteSelectButton() {
  return (
    <Link
      href={`${BRAND.url}/select`}
      className="absolute top-4 left-4 z-30 md:top-8 md:left-8"
      aria-label="학교 선택">
      <Glass className="flex h-[54px] w-[54px] cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50">
        <LayoutGrid size={28} strokeWidth={2.5} />
      </Glass>
    </Link>
  );
});
