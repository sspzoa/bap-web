# bap-web

[밥.net](https://밥.net) 프론트엔드. **쿠키 하나**로 사이트를 고르고, UI·SEO·끼니 슬롯은 **API 카탈로그**에서 받습니다.

API: [bap-back](https://github.com/sspzoa/bap-back) · 문서: [/docs](https://밥.net/docs) · 에이전트: [AGENTS.md](./AGENTS.md)

## 개요

- `/` — 선택한 사이트 식단 (쿠키 `bap-site-id`)
- `/select` — 사이트 선택
- `/docs` — API 문서 (카탈로그·MCP 포함, `GET /docs`에서 렌더)

사이트별 App Router 폴더는 **없습니다**. 백엔드에 프로바이더만 추가하면 select·홈·docs에 자동 반영됩니다.

## 빠른 시작

```bash
bun install
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001 bun dev   # 기본 :3000
```

로컬 API가 3000이면 `NEXT_PUBLIC_API_BASE_URL` 생략 가능 (운영 API 기본값).

```bash
bun run build
bun start
bun run lint
```

## 환경 변수

| 변수 | 기본값 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.xn--rh3b.net` | API 베이스 (`https://api.밥.net`과 동일 호스트) |

코드에서는 `src/shared/lib/apiBase.ts`의 `API_BASE_URL`을 사용합니다.

## 라우팅

Next.js 16 **`proxy.ts`** (middleware 대체):

| 경로 | 동작 |
|---|---|
| `/` + 쿠키 없음 | → `/select` |
| `/`, `/select`, `/docs` | `x-site-id` 헤더 주입 (select·docs는 비움) |
| `/` + 잘못된 site id | 페이지에서 `/select`로 redirect |

클라이언트는 쿠키를 직접 읽지 않고 `useSite()` / `SiteProvider`를 씁니다.

## 데이터 흐름

```
GET / (catalog)           →  layout / select / docs / manifest
GET /{basePath}/{date}    →  TanStack Query (useMealQuery)
GET /docs                 →  /docs 페이지 (엔드포인트·MCP·프로바이더 가이드)
POST /mcp                 → 에이전트 (프론트가 호출하지 않음)
SSR initialData           →  오늘 날짜에만 시드 (날짜 변경 시 다른 날 메뉴로 섞이지 않음)
```

## 디렉터리

```
src/
  app/              App Router (pages, OG, manifest)
  shared/
    components/     MealLayout, MealSection, Glass, …
    hooks/          useMealQuery, useMealData, …
    lib/            catalog, mealService, apiBase, queryKeys
    types/          SitePresentation, PublicDayMenu, …
  sites/
    config.ts       BRAND 상수만
    context.tsx     SiteProvider
    server.ts       getSiteId() — proxy 헤더
  proxy.ts          Edge 라우팅·쿠키
public/
  img/              끼니 배경 SVG
  icons/            PWA·favicon
  og.png            OG/Twitter 카드
```

## 새 사이트 추가

**기본은 프론트 수정 없음.** 학교는 bap-back 프로바이더 + `presentation`으로만 추가합니다. 카탈로그가 `/select`, 홈, 엣지 패널, `/docs`, PWA manifest, MCP `bap_list_providers`에 같이 반영됩니다.

공개 가이드: [밥.net/docs#adding-provider](https://밥.net/docs#adding-provider) · 백엔드 절차: [bap-back README](https://github.com/sspzoa/bap-back#새-프로바이더-추가)

하지 말 것:

- `src/sites/{id}/` 트리, `SITES` 맵, `/kdmhs` 같은 경로 하드코딩
- 클라이언트에서 `bap-site-id` 쿠키를 읽어 라우팅
- `/docs`에 엔드포인트·MCP·오류 문구를 하드코딩 (`GET /docs`만 렌더)

필요할 때만:

| 상황 | 프론트에서 할 일 |
|---|---|
| 기존 아침·점심·저녁 에셋 재사용 | 없음. presentation이 `/icon/lunch.svg` 등을 가리키면 됨 |
| 새 끼니 아이콘·배경 | `public/icon`, `public/img`에 파일 추가 후 presentation URL 맞추기 |
| 메뉴 사진 검색 | 백엔드 `features.foodSearch: true` + `handleExtraRoute`. 프론트 `mealSection`이 플래그만 봄 |

`presentation` 계약은 백엔드 `SitePresentation`과 동일합니다 (`src/shared/types`). 카탈로그에 `id`, `basePath`, `meals[]`가 없으면 `getCatalog()`가 그 사이트를 버립니다.

## 스택

- Next.js 16, React 19, Tailwind 4
- TanStack Query (식단 fetch·prefetch)
- Jotai (`currentDateAtom`만)
- Wanted Sans (globals.css CDN)
- Biome (lint/format)

## 배포

Docker (Bun 빌드, `TZ=Asia/Seoul`). 빌드 시 `NEXT_PUBLIC_API_BASE_URL` bake-in.

## 에이전트·기여

코딩 규칙은 [`AGENTS.md`](./AGENTS.md) 참고.

## 알려진 이슈

- 카탈로그 fetch 실패 시 select가 빈 그리드 (에러 UI 없음)
- 모든 사이트 OG 이미지 공유 (`public/og.png`)
- React Query Devtools가 prod에서도 마운트됨
