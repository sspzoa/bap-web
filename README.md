# bap-web

[밥.net](https://밥.net) 프론트엔드. **쿠키 하나**로 사이트를 고르고, UI·SEO·끼니 슬롯은 **API 카탈로그**에서 받습니다.

API: [bap-back](https://github.com/sspzoa/bap-back) · 문서: [/docs](https://밥.net/docs) · 에이전트: [AGENTS.md](./AGENTS.md)

## 개요

- `/` — 선택한 사이트 식단 (쿠키 `bap-site-id`)
- `/select` — 사이트 선택
- `/docs` — API 문서 (카탈로그 기반)

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
GET / (catalog)  →  layout / select / docs / manifest
GET /{basePath}/{date}  →  TanStack Query (useMealQuery)
SSR initialData  →  오늘 날짜에만 시드 (날짜 변경 시 다른 날 메뉴로 섞이지 않음)
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

**프론트 수정 불필요** (아이콘·배경 경로는 백엔드 `presentation.meals`에 URL로 실어 보내면 됨).

필요 시 `public/img`, `public/icon`에 에셋만 추가.

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
