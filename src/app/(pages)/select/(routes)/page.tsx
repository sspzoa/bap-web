import type { Metadata } from "next";
import { SiteSelectLink } from "@/app/(pages)/select/(routes)/siteSelectLink";
import Glass from "@/shared/components/common/glass";
import { MealDesktopBackground } from "@/shared/components/mealDesktopBackground";
import { BRAND, SITE_IDS, SITES } from "@/sites/config";

export const metadata: Metadata = {
  title: { absolute: BRAND.title },
  description: "오늘 메뉴를 한곳에서 확인하세요.",
  keywords: ["식단", "급식", "학식", "구내식당", "밥.net"],
  applicationName: BRAND.title,
  robots: { index: true, follow: true },
  alternates: { canonical: `${BRAND.url}/select` },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${BRAND.url}/select`,
    siteName: BRAND.title,
    title: BRAND.title,
    description: "오늘 메뉴를 한곳에서 확인하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.title,
    description: "오늘 메뉴를 한곳에서 확인하세요.",
  },
};

export default function SelectPage() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden p-4">
      <MealDesktopBackground className="fixed inset-0 h-full w-full" />

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full max-w-[600px] flex-col items-center gap-8 md:max-w-[960px]">
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-[40px] tracking-tight">{BRAND.title}</h1>
            <p className="text-[16px] opacity-60">오늘 메뉴를 한곳에서 확인하세요</p>
          </div>

          <div className="flex w-full flex-col gap-3 md:flex-row">
            {SITE_IDS.map((id) => {
              const site = SITES[id];
              const showSchoolName = site.schoolName !== site.siteName;

              return (
                <SiteSelectLink key={id} siteId={id} href="/" className="block md:flex-1">
                  <Glass className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 p-5 transition-transform duration-100 active:scale-[0.98] active:opacity-80">
                    <p className="font-bold text-[20px] tracking-tight">{site.siteName}</p>
                    {showSchoolName && <p className="text-[14px] opacity-55">{site.schoolName}</p>}
                  </Glass>
                </SiteSelectLink>
              );
            })}
          </div>
        </div>
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
