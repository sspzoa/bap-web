import type { ReactNode } from "react";
import { sitePreferenceHref } from "@/shared/lib/sitePreference";

export function SiteSelectLink({
  siteId,
  className,
  children,
}: {
  siteId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={sitePreferenceHref(siteId)} className={className}>
      {children}
    </a>
  );
}
