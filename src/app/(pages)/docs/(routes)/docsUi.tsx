import type { ReactNode } from "react";
import Glass from "@/shared/components/common/glass";

const METHOD_STYLES: Record<string, string> = {
  GET: "text-emerald-300",
  POST: "text-amber-300",
};

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-3">
      <h2 className="font-bold text-[20px] tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-[12px] bg-black/25 p-3 font-mono text-[13px] leading-relaxed">
      {children}
    </pre>
  );
}

export function Endpoint({ method, path, children }: { method: "GET" | "POST"; path: string; children: ReactNode }) {
  return (
    <Glass className="flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className={`font-bold text-[13px] tracking-tight ${METHOD_STYLES[method] ?? "opacity-55"}`}>
          {method}
        </span>
        <p className="break-all font-bold text-[18px] tracking-tight">{path}</p>
      </div>
      {children}
    </Glass>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-[14px] leading-relaxed opacity-55">{children}</p>;
}

export function FieldTable({ rows }: { rows: { name: string; type: string; description: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-[12px] bg-black/20">
      <table className="w-full min-w-[480px] text-left text-[13px]">
        <thead>
          <tr className="border-white/10 border-b">
            <th className="px-3 py-2 font-bold opacity-50">필드</th>
            <th className="px-3 py-2 font-bold opacity-50">타입</th>
            <th className="px-3 py-2 font-bold opacity-50">설명</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.name}-${row.type}`} className="border-white/5 border-b last:border-0">
              <td className="px-3 py-2 font-mono">{row.name}</td>
              <td className="px-3 py-2 font-mono opacity-70">{row.type}</td>
              <td className="px-3 py-2 opacity-70">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProviderCard({
  basePath,
  name,
  schoolName,
  meals,
  foodSearch,
}: {
  basePath: string;
  name: string;
  schoolName: string;
  meals: { id: string; title: string; operatingHours: string | null }[];
  foodSearch: boolean;
}) {
  return (
    <Glass className="flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-bold text-[20px] tracking-tight">{basePath}</p>
        {foodSearch && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 font-bold text-[11px] uppercase tracking-wide opacity-70">
            search
          </span>
        )}
      </div>
      <p className="text-[14px] opacity-55">
        {name} · {schoolName}
      </p>
      <div className="flex flex-col gap-1">
        {meals.map((meal) => (
          <p key={meal.id} className="font-mono text-[13px] opacity-70">
            {meal.id} · {meal.title}
            {meal.operatingHours ? ` · ${meal.operatingHours}` : ""}
          </p>
        ))}
      </div>
    </Glass>
  );
}

export function TocLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="text-[14px] underline underline-offset-4 opacity-60 duration-100 hover:opacity-90 active:opacity-40">
      {label}
    </a>
  );
}
