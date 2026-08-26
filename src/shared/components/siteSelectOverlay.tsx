"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import Glass from "@/shared/components/common/glass";
import { SiteSelectView } from "@/shared/components/siteSelectView";
import { useSiteSelect } from "@/sites/context";

export function SiteSelectOverlay() {
  const { isSelecting, closeSelect } = useSiteSelect();

  useEffect(() => {
    if (!isSelecting) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSelect();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSelect, isSelecting]);

  if (!isSelecting) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <button type="button" onClick={closeSelect} aria-label="닫기" className="absolute top-4 right-4 z-20">
        <Glass className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center duration-100 active:scale-95 active:opacity-50">
          <X size={22} strokeWidth={2.5} />
        </Glass>
      </button>
      <SiteSelectView />
    </div>
  );
}
