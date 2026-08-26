"use client";

import type { ReactNode } from "react";
import Glass from "@/shared/components/common/glass";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a
          key={index}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2">
          {link[1]}
        </a>
      );
    }

    return part;
  });
}

export function ChangelogMarkdown({ markdown }: { markdown: string }) {
  if (!markdown.trim()) {
    return null;
  }

  const blocks: ReactNode[] = [];
  let listItems: ReactNode[] = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }
    blocks.push(
      <ul key={`list-${blocks.length}`} className="list-disc space-y-1 pl-5">
        {listItems}
      </ul>,
    );
    listItems = [];
  };

  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      blocks.push(
        <h1 key={`h1-${blocks.length}`} className="font-bold text-[18px] tracking-tight">
          {renderInline(trimmed.slice(2))}
        </h1>,
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="mt-3 font-bold text-[15px] tracking-tight first:mt-0">
          {renderInline(trimmed.slice(3))}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="mt-2 font-semibold text-[13px] uppercase tracking-wide opacity-55">
          {renderInline(trimmed.slice(4))}
        </h3>,
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(<li key={`li-${listItems.length}`}>{renderInline(trimmed.slice(2))}</li>);
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-[13px] leading-relaxed opacity-70">
        {renderInline(trimmed)}
      </p>,
    );
  }

  flushList();

  return (
    <Glass className="w-full max-h-[min(40vh,320px)] overflow-y-auto p-4 text-left md:p-5">
      <div className="flex flex-col gap-1">{blocks}</div>
    </Glass>
  );
}
