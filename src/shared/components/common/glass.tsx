import type { HTMLAttributes, ReactNode } from "react";
import { memo } from "react";

interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default memo(function Glass({ children, className = "", ...props }: GlassProps) {
  return (
    <div
      className={`overflow-y-auto rounded-[15px] border-2 border-white/10 bg-white/20 shadow-[0_0_10px_rgba(0,0,0,0.05)] backdrop-blur-[24px] ${className}`}
      {...props}>
      {children}
    </div>
  );
});
