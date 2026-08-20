import type { Metadata } from "next";
import Glass from "@/shared/components/common/glass";
import { MealDesktopBackground } from "@/shared/components/mealDesktopBackground";
import { SITE_IDS, SITES } from "@/sites/config";

export const metadata: Metadata = {
  title: { absolute: "사이트 선택 | 밥.net" },
  description: "학교별 식단 사이트를 선택하세요.",
  keywords: ["식단", "급식", "학식", "밥.net"],
  applicationName: "밥.net",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://밥.net/select" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://밥.net/select",
    siteName: "밥.net",
    title: "사이트 선택 | 밥.net",
    description: "학교별 식단 사이트를 선택하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "사이트 선택 | 밥.net",
    description: "학교별 식단 사이트를 선택하세요.",
  },
};

export default function SelectPage() {
  return (
    <div className="relative flex h-svh items-center justify-center overflow-hidden p-4">
      <MealDesktopBackground className="fixed inset-0 h-full w-full" />

      <div className="z-10 flex w-full max-w-[600px] flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-bold text-[40px] tracking-tight">밥.net</h1>
          <p className="text-[16px] opacity-60">사이트를 선택하세요</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          {SITE_IDS.map((id) => (
            <a key={id} href={SITES[id].url}>
              <Glass className="flex w-full cursor-pointer items-center justify-center p-5 transition-transform duration-100 active:scale-[0.98] active:opacity-80">
                <p className="font-bold text-[20px] tracking-tight">{SITES[id].schoolName}</p>
              </Glass>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
