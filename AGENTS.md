<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# bap-web — agent notes

## Product

Cookie-based multi-tenant meal app. One home UI for all schools; backend catalog drives names, meal slots, icons, backgrounds, and feature flags.

Pair repo: **bap-back** (API). Default API: `https://api.밥.net` / `https://api.xn--rh3b.net`.

## Do

- **Catalog first** — `getCatalog()` / `useSite()` for site metadata. Never hardcode `/kdmhs`, `/dgu`, `/horang` or a `SITES` map.
- **Single meal UI** — extend `src/shared/components/mealLayout.tsx`, `mealSection.tsx`, shared hooks. Do not add `src/sites/{id}/` trees.
- **Proxy, not middleware** — routing lives in `src/proxy.ts`. Pass site context via headers (`x-site-id`, `x-pathname`), read on server with `getSiteId()` from `src/sites/server.ts`.
- **API base** — import `API_BASE_URL` from `src/shared/lib/apiBase.ts` for fetch and docs examples.
- **TanStack Query for meals** — keys in `src/shared/lib/queryKeys.ts`. Do not cache API meal data in Jotai (date atom only).
- **SSR hydration** — `initialData` from the server applies only when `formattedDate === initialFormattedDate` (see `useMealQuery`).
- **Shared layer boundaries** — `src/shared/**` must not import from `src/app/(pages)/**`.
- **Next.js 16** — read `node_modules/next/dist/docs/` before changing routing, metadata, OG, or proxy.
- **Docs page** — fetch `GET /docs` via `getApiDocs()`; do not hardcode endpoint/type/error/MCP copy in the frontend.

## Don't

- Recreate per-site pages or duplicate meal renderers.
- Read `bap-site-id` cookie in client components for routing.
- Commit changes that remove the Next.js block above (next dev will re-add it).

## Key paths

| Path | Role |
|---|---|
| `src/proxy.ts` | Cookie → redirect / headers |
| `src/shared/lib/catalog.ts` | `GET /` catalog (60s revalidate) |
| `src/shared/lib/mealService.ts` | Meal fetch + kdmhs search |
| `src/shared/hooks/useMealQuery.ts` | Client meal query + prefetch |
| `src/shared/components/siteSelectView.tsx` | Site picker (home state, not a route) |
| `src/shared/components/siteSelectOverlay.tsx` | Picker overlay (`useSiteSelect`) |
| `src/shared/lib/docs.ts` | `GET /docs` fetch |
| `src/sites/config.ts` | `BRAND` only |
| `public/og.png` | Static OG (served by `ogCard.tsx`) |

## Commands

```bash
bun dev          # NEXT_PUBLIC_API_BASE_URL=http://localhost:3001 if API not on prod
bun run build    # run after routing / data-flow changes
bun run lint
```

## Adding a school

**Backend only.** New provider + complete `presentation` in bap-back. This frontend already consumes the catalog:

| Surface | Source |
|---|---|
| `/` picker, home, edge panel, manifest | `GET /` (`getCatalog`) |
| `/docs` (endpoints, MCP, 새 프로바이더 가이드) | `GET /docs` (`getApiDocs`) |
| MCP tools | `POST /mcp` on the API — not called from this app |

Do **not** add `src/sites/{id}/`, a `SITES` map, or hardcoded `/kdmhs` paths. If new meal art is required, add files under `public/icon` and `public/img` and point `presentation.meals` at those URLs. `features.foodSearch` toggles search UI; the search HTTP route lives on the API.

Walkthrough: [README.md](./README.md#새-사이트-추가) · [bap-back](https://github.com/sspzoa/bap-back#새-프로바이더-추가) · [밥.net/docs#adding-provider](https://밥.net/docs#adding-provider).

## Review checklist

- [ ] No hardcoded provider IDs or API paths
- [ ] Catalog empty-state acceptable for the change
- [ ] Date navigation does not reuse wrong day's `initialData`
- [ ] Docs/curl examples use `API_BASE_URL`; MCP and provider-guide copy come from `GET /docs` only

See [README.md](./README.md) for architecture and env vars.
