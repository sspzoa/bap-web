"use client";

import Glass from "@/shared/components/common/glass";
import { MealDesktopBackground } from "@/shared/components/mealDesktopBackground";
import { SiteSelectLink } from "@/shared/components/siteSelectLink";
import { API_BASE_URL } from "@/shared/lib/apiBase";
import { BRAND } from "@/sites/config";
import { useCatalog, useOptionalSiteId } from "@/sites/context";

const linkClassName =
  "font-bold text-[15px] uppercase tracking-tight underline underline-offset-4 opacity-60 duration-100 active:opacity-40";

export function SiteSelectView() {
  const catalog = useCatalog();
  const currentSiteId = useOptionalSiteId();

  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden p-4">
      <MealDesktopBackground className="fixed inset-0 h-full w-full" />

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full max-w-[600px] flex-col items-center gap-8 md:max-w-[960px]">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-baseline gap-2">
              <h1 className="font-bold text-[40px] tracking-tight">{BRAND.title}</h1>
              <span className="font-medium text-[14px] opacity-40 tabular-nums">v{BRAND.version}</span>
            </div>
            <p className="text-[16px] opacity-60">오늘 메뉴를 한곳에서 확인하세요</p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
            {catalog.map((site) => {
              const showSchoolName = site.schoolName !== site.name;
              const isCurrent = site.id === currentSiteId;

              return (
                <SiteSelectLink key={site.id} siteId={site.id} className="block h-full">
                  <Glass
                    className={`flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 p-5 transition-transform duration-100 active:scale-[0.98] active:opacity-80 ${
                      isCurrent ? "bg-white/30" : ""
                    }`}>
                    <p className="font-bold text-[20px] tracking-tight">{site.name}</p>
                    {showSchoolName && <p className="text-[14px] opacity-55">{site.schoolName}</p>}
                  </Glass>
                </SiteSelectLink>
              );
            })}
          </div>
        </div>
      </div>

      <div className="z-10 mt-8 mb-3 flex items-center justify-center gap-3 text-[15px] opacity-60">
        <a
          href={`${API_BASE_URL}/docs`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}>
          API docs
        </a>
        <span aria-hidden className="select-none opacity-50">
          ·
        </span>
        <a
          href={`${API_BASE_URL}/changelog`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}>
          CHANGELOG
        </a>
      </div>

      <footer className="z-10 pb-2 text-center text-[13px] opacity-45">
        maintained by{" "}
        <a
          href="https://github.com/sspzoa"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 duration-100 active:opacity-70">
          sspzoa
        </a>
        ,{" "}
        <a
          href="https://github.com/vvcnyy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 duration-100 active:opacity-70">
          vvcnyy
        </a>
      </footer>
    </div>
  );
}
