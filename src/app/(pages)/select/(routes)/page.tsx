import Image from "next/image";
import Glass from "@/shared/components/common/glass";
import { SITES, type SiteId } from "@/sites/config";

const SITE_IDS: SiteId[] = ["kdmhs", "dgu"];

export default function SelectPage() {
  return (
    <div className="relative flex h-svh items-center justify-center overflow-hidden p-4">
      <div className="fixed inset-0 h-full w-full">
        <Image
          src="/img/dinner.svg"
          alt="배경"
          fill
          style={{ objectFit: "cover", objectPosition: "50% 90%" }}
          priority
          draggable={false}
        />
      </div>

      <div className="z-10 flex w-full max-w-[600px] flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold text-[40px] tracking-tight">밥.net</p>
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
