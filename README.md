# bap-web

[밥.net](https://밥.net) 프론트엔드. **쿠키 하나**로 사이트를 고르고, UI·SEO·끼니 슬롯은 **API 카탈로그**에서 받습니다.

API: [bap-back](https://github.com/sspzoa/bap-back) · 문서: [api.밥.net/docs](https://api.밥.net/docs) · 에이전트: [AGENTS.md](./AGENTS.md)

## 개요

- `/` — 식단. 쿠키가 없으면 같은 페이지에서 사이트를 고릅니다 (쿠키 `bap-site-id`)
- `/?site={id}` — `bap-site-id` 쿠키를 넣고 `/`로 이동 (예: `/?site=kdmhs`)
- `/?home=1` — `bap-site-id` 쿠키를 지우고 사이트 선택 UI로 이동
- `/docs` — API Scalar로 리다이렉트 (`api.밥.net/docs`)

사이트별 App Router 폴더는 **없습니다**. 백엔드에 프로바이더만 추가하면 홈 사이트 선택·manifest에 자동 반영됩니다.

## 빠른 시작

```bash
bun install --frozen-lockfile
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
| `NEXT_PUBLIC_ADFIT_UNIT_MOBILE` | 비어 있음 | 카카오 애드핏 320×100. 홈(좁은 화면), 모바일 식단의 시간 기본 끼니 카드, 학교 변경 패널이 열린 동안의 화면 아래. 한 화면에 하나만. 비우면 그 칸을 그리지 않음 |
| `NEXT_PUBLIC_ADFIT_UNIT_PC` | 비어 있음 | 카카오 애드핏 728×90. 홈(넓은 화면)과, 넓은 식단 화면에서 끼니 카드 줄 아래. 비우면 그 칸을 그리지 않음 |

코드에서는 API 주소를 `src/shared/lib/apiBase.ts`의 `API_BASE_URL`로 읽고, 광고단위는 위 환경 변수만 사용합니다. 예시는 [`.env.example`](./.env.example).

`NEXT_PUBLIC_*` 는 빌드에 구워집니다. Vercel·Docker 모두 빌드 시점에 넣어야 화면에 반영됩니다.

## 광고 (카카오 애드핏)

학교별 홈 페이지는 없습니다. 홈은 쿠키가 없을 때의 사이트 선택 화면 하나이고, 학교를 고르면 식단 화면입니다.

- 홈: 학교 그리드와 푸터 사이. 800px 미만은 320×100, 이상은 728×90.
- 모바일 식단(800px 미만): 현재 한국 시각 기준 기본 끼니 카드 하나에서, 제목·칼로리 바로 아래, 첫 `-` 메뉴 앞에 320×100을 가운데 둡니다. 기본 끼니는 `getCurrentMealTiming`입니다. 슬롯을 순서대로 보며 `activeUntilHour`가 지금 시각보다 큰 첫 끼니를 고르고, 없으면 첫 끼니입니다. 앱이 처음 그 카드로 스크롤하는 함수와 같습니다. 다른 카드로 밀어도 광고는 그 카드에 남습니다. 학교 변경 패널이 열리면 이 칸을 지우고 화면 아래 배너로 바꿉니다.
- 데스크톱 식단(800px 이상): 끼니 카드 줄 아래에 728×90을 가운데 둡니다.
- 모바일에서 학교 변경 패널이 열리고 배경이 딤되면, 딤 위·학교 목록 아래, 화면 맨 밑에 320×100을 고정합니다. safe-area를 비웁니다. 패널이 닫히면 카드 안 배너로 돌아갑니다.
- 배너 주변에 유리 카드나 「광고」 글자는 없습니다. 칸 크기만 고정해서 광고가 늦게 그려져도 밀리지 않습니다.
- 광고단위가 비어 있으면 그 칸은 없습니다.
- 스크립트 `https://t1.daumcdn.net/kas/static/ba.min.js` 는 한 번만 불러오고, 클라이언트 라우트나 패널 열림으로 배너가 다시 마운트되면 기존 유닛을 지운 뒤 다시 그립니다.

매체와 광고단위는 [애드핏](https://adfit.kakao.com) 대시보드에서 `밥.net` 승인 후 발급합니다. 공식 웹 설치 절차에는 `ads.txt`가 없습니다. 대시보드에서 별도 줄을 안내하면 그때 `public/ads.txt`에 추가하면 됩니다.

## 홈 카드

800px 미만에서는 학교 카드 안의 이름과 정식 명칭이 한 줄에 나란히 있습니다. 800px 이상에서는 카드 안에서 위아래로 쌓입니다.

## 라우팅

Next.js 16 **`proxy.ts`** (middleware 대체):

| 경로 | 동작 |
|---|---|
| `/` + 쿠키 없음 | 홈에서 사이트 선택 UI (리다이렉트 없음) |
| `/?site={id}` | `bap-site-id` 쿠키 설정 후 쿼리 제거·리다이렉트 |
| `/?home=1` | `bap-site-id` 쿠키 삭제, 이번 요청은 사이트 선택 UI |
| 없는 경로 | → `/` (쿼리 유지) |
| `/` | `x-site-id` 헤더 주입 |
| `/docs` | → `API_BASE_URL/docs` (Scalar) |
| `/` + 잘못된 site id | 홈에서 사이트 선택 UI |

클라이언트는 쿠키를 직접 읽지 않고 `useSite()` / `SiteProvider`를 씁니다. 홈으로 가면 `bap-site-id`를 지우고 사이트 선택 UI를 보여 줍니다.

## 데이터 흐름

```
GET / (catalog)           →  layout / 홈 선택 UI / manifest
GET /{basePath}/{date}    →  TanStack Query (useMealQuery)
GET /docs (API)           →  Scalar (백엔드가 직접 서빙)
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

**기본은 프론트 수정 없음.** 학교는 bap-back 프로바이더 + `presentation`으로만 추가합니다. 카탈로그가 홈 사이트 선택, 엣지 패널, PWA manifest, MCP `bap_list_providers`에 같이 반영됩니다.

공개 문서: [api.밥.net/docs](https://api.밥.net/docs) · 백엔드 절차: [bap-back README](https://github.com/sspzoa/bap-back#새-프로바이더-추가)

하지 말 것:

- `src/sites/{id}/` 트리, `SITES` 맵, `/kdmhs` 같은 경로 하드코딩
- 클라이언트에서 `bap-site-id` 쿠키를 읽어 라우팅
- API 문서를 프론트에 다시 구현 (Scalar은 백엔드 `/docs`)

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

Docker (Bun 빌드, `TZ=Asia/Seoul`). 빌드 시 `NEXT_PUBLIC_API_BASE_URL`과 애드핏 광고단위가 bake-in.

## 에이전트·기여

코딩 규칙은 [`AGENTS.md`](./AGENTS.md) 참고.

## 알려진 이슈

- 카탈로그 fetch 실패 시 사이트 선택이 빈 그리드 (에러 UI 없음)
- 모든 사이트 OG 이미지 공유 (`public/og.png`)
- React Query Devtools가 prod에서도 마운트됨
