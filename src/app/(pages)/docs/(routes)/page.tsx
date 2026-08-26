import type { Metadata } from "next";
import {
  Code,
  Endpoint,
  FieldTable,
  Guide,
  Note,
  ProviderCard,
  Section,
  TocLink,
} from "@/app/(pages)/docs/(routes)/docsUi";
import Glass from "@/shared/components/common/glass";
import { MealDesktopBackground } from "@/shared/components/mealDesktopBackground";
import { API_BASE_URL } from "@/shared/lib/apiBase";
import { getApiDocs } from "@/shared/lib/docs";
import { BRAND } from "@/sites/config";

export const metadata: Metadata = {
  title: { absolute: `API · ${BRAND.title}` },
  description: "밥.net 식단 API · MCP 문서 — 카탈로그, 통일 식단 스키마, 프로바이더 추가",
  keywords: ["식단", "급식", "학식", "구내식당", "API", "MCP", "밥.net"],
  applicationName: BRAND.title,
  robots: { index: true, follow: true },
  alternates: { canonical: `${BRAND.url}/docs` },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${BRAND.url}/docs`,
    siteName: BRAND.title,
    title: `API · ${BRAND.title}`,
    description: "밥.net 식단 API · MCP 문서",
  },
  twitter: {
    card: "summary_large_image",
    title: `API · ${BRAND.title}`,
    description: "밥.net 식단 API · MCP 문서",
  },
};

export default async function DocsPage() {
  const apiDocs = await getApiDocs();

  if (!apiDocs) {
    return (
      <div className="relative min-h-svh overflow-x-hidden p-4">
        <MealDesktopBackground className="fixed inset-0 h-full w-full" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-[720px] flex-col items-center justify-center gap-4">
          <Glass className="p-6 text-center">
            <p className="font-bold text-[20px] tracking-tight">문서를 불러오지 못했어요</p>
            <p className="mt-2 text-[15px] opacity-60">
              API가 켜져 있는지, <code className="font-mono opacity-80">{API_BASE_URL}/docs</code> 에 접근 가능한지
              확인해 주세요.
            </p>
          </Glass>
          <a href="/" className="text-[14px] underline underline-offset-4 opacity-55">
            {BRAND.title}으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  const { docs, providers } = apiDocs;
  const endpointById = Object.fromEntries(docs.endpoints.map((endpoint) => [endpoint.id, endpoint]));

  const renderEndpoint = (id: string, title: string) => {
    const endpoint = endpointById[id];
    if (!endpoint) {
      return null;
    }

    return (
      <Section id={id} title={title}>
        <Endpoint method={endpoint.method} path={endpoint.path}>
          <p className="text-[15px] opacity-70">{endpoint.description}</p>
          {endpoint.curls.map((curl) => (
            <Code key={curl}>{curl}</Code>
          ))}
          {endpoint.responseExample && <Code>{endpoint.responseExample}</Code>}
          {endpoint.fieldTables?.map((table) => (
            <div key={table.title ?? "table"}>
              {table.title && <p className="font-bold text-[14px] opacity-60">{table.title}</p>}
              <FieldTable rows={table.rows} />
            </div>
          ))}
          {endpoint.notes?.map((note) => (
            <Note key={note}>{note}</Note>
          ))}
        </Endpoint>
      </Section>
    );
  };

  return (
    <div className="relative min-h-svh overflow-x-hidden p-4">
      <MealDesktopBackground className="fixed inset-0 h-full w-full" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-[720px] flex-col">
        <header className="flex items-center justify-between">
          <a href="/" className="font-bold text-[18px] tracking-tight md:text-[20px]">
            {BRAND.title}
          </a>
          <p className="text-[13px] opacity-55">API</p>
        </header>

        <main className="flex flex-1 flex-col gap-10 py-12">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-[40px] tracking-tight">{docs.title}</h1>
            <p className="text-[16px] opacity-60">{docs.subtitle}</p>
          </div>

          <Glass className="flex flex-wrap gap-x-4 gap-y-2 p-4">
            {docs.toc.map((item) => (
              <TocLink key={item.id} href={`#${item.id}`} label={item.label} />
            ))}
          </Glass>

          <Section id="overview" title="개요">
            <Glass className="flex flex-col gap-3 p-5">
              <div>
                <p className="font-bold text-[15px] opacity-50">Base URL</p>
                <Code>{docs.baseUrl}</Code>
              </div>
              <Note>
                이 페이지는 <code className="font-mono opacity-80">{API_BASE_URL}/docs</code> 에서 문서를 불러옵니다.
              </Note>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-[14px] opacity-70">
                {docs.overviewBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </Glass>
          </Section>

          <Section id="providers" title="프로바이더">
            {providers.length === 0 ? (
              <Glass className="p-5">
                <p className="text-[15px] opacity-70">등록된 프로바이더가 없어요.</p>
              </Glass>
            ) : (
              <div className="flex flex-col gap-3">
                {providers.map((site) => (
                  <ProviderCard
                    key={site.id}
                    basePath={site.basePath}
                    name={site.name}
                    schoolName={site.schoolName}
                    meals={site.meals}
                    foodSearch={site.features.foodSearch}
                  />
                ))}
              </div>
            )}
            <Note>{docs.providerNote}</Note>
          </Section>

          {renderEndpoint("catalog", "카탈로그")}
          {renderEndpoint("meals", "식단")}
          {renderEndpoint("search", "메뉴 검색")}
          {renderEndpoint("health", "헬스")}
          {renderEndpoint("mcp", "MCP")}

          <Section id="types" title="타입">
            <Glass className="flex flex-col gap-4 p-5">
              {docs.typeSchemas.map((schema) => (
                <div key={schema.title}>
                  <p className="mb-2 font-bold text-[15px] opacity-60">{schema.title}</p>
                  <FieldTable rows={schema.rows} />
                </div>
              ))}
            </Glass>
          </Section>

          <Section id="errors" title="오류">
            <Glass className="flex flex-col gap-4 p-5">
              <Code>{docs.errors.example}</Code>
              <FieldTable rows={docs.errors.rows} />
              <Note>{docs.errors.note}</Note>
            </Glass>
          </Section>

          {(docs.guides ?? []).map((guide) => (
            <Section key={guide.id} id={guide.id} title={guide.title}>
              <Guide
                intro={guide.intro}
                steps={guide.steps}
                tables={guide.fieldTables}
                checklist={guide.checklist}
                notes={guide.notes}
              />
            </Section>
          ))}
        </main>

        <footer className="pb-2 text-center text-[13px] opacity-45">
          <a href="/" className="underline underline-offset-2 duration-100 active:opacity-70">
            {BRAND.title}
          </a>
          {" · "}
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
    </div>
  );
}
