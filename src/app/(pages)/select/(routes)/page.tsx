import type { Metadata } from "next";
import Glass from "@/shared/components/common/glass";
import { MealDesktopBackground } from "@/shared/components/mealDesktopBackground";
import { SiteSelectLink } from "@/app/(pages)/select/(routes)/siteSelectLink";
import { BRAND, SITE_IDS, SITES } from "@/sites/config";

export const metadata: Metadata = {
  title: { absolute: BRAND.title },
  description: BRAND.tagline,
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
    description: BRAND.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.title,
    description: BRAND.tagline,
  },
};

export default function SelectPage() {
  return (
    <div className="relative flex h-svh items-center justify-center overflow-hidden p-4">
      <MealDesktopBackground className="fixed inset-0 h-full w-full" />

      <div className="z-10 flex w-full max-w-[600px] flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-bold text-[40px] tracking-tight">{BRAND.title}</h1>
          <p className="text-[16px] opacity-60">{BRAND.tagline}</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          {SITE_IDS.map((id) => (
            <SiteSelectLink key={id} siteId={id} href="/">
              <Glass className="flex w-full cursor-pointer items-center justify-center p-5 transition-transform duration-100 active:scale-[0.98] active:opacity-80">
                <p className="font-bold text-[20px] tracking-tight">{SITES[id].schoolName}</p>
              </Glass>
            </SiteSelectLink>
          ))}
        </div>
      </div>
    </div>
  );
}
