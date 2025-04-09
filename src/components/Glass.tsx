import { ReactNode, HTMLAttributes } from "react";

interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function Glass({ children, className = "", ...props }: GlassProps) {
  return (
    <div
      className={`rounded-[15px] bg-white/20 border-2 border-white/10 backdrop-blur-[48px] shadow-[0_0_10px_rgba(0,0,0,0.05)] overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}