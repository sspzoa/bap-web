# bap-web

학교별 급식 웹. 호스트로 사이트를 고르고, API는 각 사이트의 `apiPath`만 호출합니다.

- `밥.net` — 한국디지털미디어고등학교 (`/kdmhs`)
- `dflex.밥.net` — 동국대학교 경영관 D-Flex (`/dgu`)
- `mega.밥.net` — 메가스터디 구내식당 (`/mega`)

호스트가 등록되지 않으면 `/select`로 보냅니다. 기본 사이트는 없습니다.
로컬에서는 `SITE_ID=kdmhs` 또는 `SITE_ID=dgu` 또는 `SITE_ID=mega`로 고릅니다.
