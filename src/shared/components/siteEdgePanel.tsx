"use client";

import { LayoutGrid } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import Glass from "@/shared/components/common/glass";
import { setSitePreferenceCookie } from "@/shared/lib/sitePreference";
import { useCatalog, useSiteId } from "@/sites/context";

const SWIPE_THRESHOLD = 40;

export const SiteEdgePanel = memo(function SiteEdgePanel() {
  const siteId = useSiteId();
  const catalog = useCatalog();
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  const selectSite = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setSitePreferenceCookie(id);

    if (id === siteId) {
      close();
      return;
    }

    window.location.assign("/");
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) {
      return;
    }

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (deltaX <= -SWIPE_THRESHOLD) {
      setIsOpen(true);
      return;
    }

    if (deltaX >= SWIPE_THRESHOLD) {
      setIsOpen(false);
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden md:hidden">
      {isOpen && (
        <button
          type="button"
          className="pointer-events-auto absolute inset-0 bg-black/20"
          onClick={close}
          aria-label="닫기"
        />
      )}

      <div
        className={`-translate-y-1/2 pointer-events-auto absolute top-1/2 right-0 flex items-stretch transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "translate-x-[calc(100%-22px)]"
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        <button
          type="button"
          onClick={toggle}
          aria-label="학교 선택"
          aria-expanded={isOpen}
          className="flex h-[96px] w-[22px] items-center justify-center self-center rounded-l-[14px] border-2 border-white/10 border-r-0 bg-white/20 shadow-[0_0_10px_rgba(0,0,0,0.05)] backdrop-blur-[24px]">
          <LayoutGrid size={14} strokeWidth={2.5} />
        </button>

        <Glass className="!rounded-r-none flex w-[220px] flex-col gap-2 border-r-0 p-3">
          {catalog.map((site) => (
            <a
              key={site.id}
              href="/"
              onClick={(event) => selectSite(event, site.id)}
              className={`rounded-[12px] px-3 py-3 text-left duration-100 active:scale-[0.98] active:opacity-70 ${
                site.id === siteId ? "bg-white/30" : ""
              }`}>
              <p className="font-bold text-[16px] tracking-tight">{site.name}</p>
            </a>
          ))}
          <a
            href="/docs"
            className="rounded-[12px] px-3 py-3 text-left duration-100 active:scale-[0.98] active:opacity-70">
            <p className="font-bold text-[16px] tracking-tight">API</p>
          </a>
        </Glass>
      </div>
    </div>
  );
});
