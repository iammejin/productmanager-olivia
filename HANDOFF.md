# productmanager-olivia.com — 작업 현황

> 최종 갱신: 2026-05-12
> 다음 세션에서 이 파일을 가장 먼저 읽고 컨텍스트 회복할 것

---

## 1. 프로젝트 개요

- **도메인**: productmanager-olivia.com
- **운영자**: 김혜진 (Olivia / @pm_mejin)
- **유형**: 1인 PM 인플루언서 포트폴리오 + 멘토링 사이트
- **KPI**: 콘텐츠 아카이브 + 검색 인지도 (전환 아님)
- **MVP 목표**: 1개월 내 오픈

## 2. 기술 스택 (확정)

- **Astro 6.3.1** + TypeScript strict
- **Vanilla CSS** (Tailwind 미사용) + CSS variables 디자인 토큰
- **Pretendard Variable** self-hosted (`public/fonts/`)
- **Notion as CMS** (hybrid): markdown for blog, Notion DB for mentoring·reviews·cohorts
- **Vercel** 정적 호스팅 (배포 예정, 아직 안 함)
- 결제·DB·인증 X — 멘토링 신청은 노션 외부 폼 링크, 전자책은 litt.ly

이전 스택(`pm-mejin-site/` Next.js + Supabase)은 이 디렉토리 옆에 그대로 두고 참고용으로만 사용.

## 3. 디자인 시스템

- 배경 `#FBF9F4` 크림 · 텍스트 `#1A1A1A` 차콜
- 강조 `#FF6B1A` 주황 (면적 1–3% 원칙 — 라벨/포인트 단어/마침표만)
- 마커펜 `#FFE8D6`
- 보더 `#E8E3D8`
- 가드레일: `box-shadow` X / `gradient` X / `border-radius > 4px` X / pill 버튼 X
- 한국어 본문 `line-height: 1.75` 고정

토큰 정의: `src/styles/tokens.css` (금지사항 주석도 포함)

## 4. 완성된 페이지 (7 routes + RSS + sitemap)

| URL | 파일 | 설명 |
|---|---|---|
| `/` | `pages/index.astro` | Hero (1.4:1 그리드, "구조" 강조, 마커펜, Label–Value 컨택) |
| `/about` | `pages/about.astro` | Hero / Beliefs / Work(4개 회사) / Activities / Get in touch |
| `/writing` | `pages/writing/index.astro` | 글 리스트 + 태그 chips |
| `/writing/[slug]` | `pages/writing/[...slug].astro` | 글 상세, prose 스타일 |
| `/writing/tags/[tag]` | `pages/writing/tags/[tag].astro` | 태그별 필터 |
| `/mentoring` | `pages/mentoring.astro` | Hero + Cohort 배너 + Programs + 진행방식 + 신청절차 + 후기(조건부) + eBook 크로스셀 |
| `/ebook` | `pages/ebook.astro` | 전자책 랜딩 |
| `/contact` | `pages/contact.astro` | 협업·강연·미디어·멘토링·DM 채널 분리 |
| `/rss.xml` | `pages/rss.xml.ts` | RSS 2.0 (한국어, 카테고리 = 태그) |
| `/sitemap-index.xml` | `@astrojs/sitemap` | SEO 사이트맵 |

## 5. 컴포넌트

- `layouts/BaseLayout.astro` — html/head/SEO/OG, Header/Footer 래핑
- `components/site/{Header,Footer}.astro` — GNB, 로고 점만 주황
- `components/ui/{Button,Card,TagBadge,SectionTitle}.astro` — 4종 UI primitives
- `components/sections/*` — Home Hero, About 5섹션
- `components/mentoring/{ProgramCard,ReviewCard}.astro`
- `components/writing/WritingListItem.astro`

## 6. Notion DB 연동 상태

### Mentoring 프로그램 DB
- **ID**: `4f33e3d46c1f46fa89dfad8cf6070ca2`
- **스키마**: Title / Slug / Price / Original Price / Duration / Subtitle / Bullets / Badge / External Link Label / External Link Url / Order / Active
- **상태**: DB 생성 완료 · Integration 연결 완료 · 3개 행 입력 완료 (스크립트로)

### Reviews 후기 DB
- **ID**: `be25bd5693984cf98624a8016e9f0143`
- **스키마** (폼 응답 형태): 응답자 / 프로그램 / 제출일 / 멘토링으로 도움되었던 인사이트 / 조금 더 깊이 다뤘으면 좋았겠다 싶은 부분 / 후기를 마케팅·홍보 동의
- **상태**: DB 생성 완료 · Integration 연결 완료 · 실제 응답 대기 중 (0건)
- **노출 규칙**: "후기를 마케팅..." 체크박스 true인 행만 사이트 노출. "조금 더 깊이..." 텍스트는 내부 데이터로 절대 사이트 노출 X
- **파서**: prefix 매칭(`findPropByPrefix`)으로 컬럼명 일부만 알아도 동작

### Cohorts 기수 DB
- **ID**: 아직 없음 (사용자가 다음 세션에서 만들 예정)
- **스키마**: Title / Number / Start Date / End Date / Application Deadline / Max Slots / Is Open / Active
- **상태**: 코드 완료 · DB는 사용자가 생성 + Integration 연결 + .env에 ID 추가 + `node scripts/seed-cohorts-db.mjs` 실행 필요

## 7. 핵심 아키텍처 결정

### Hybrid 데이터 흐름

- **마크다운 (git)**: Writing 블로그 글 (장기 자산, 통제 우선) → `src/content/writing/*.md`
- **노션 DB (CMS)**: 자주 바뀌는 데이터 (프로그램·후기·기수) → Astro Content Collections로 로드

모든 노션 컬렉션은 **fallback 정적 데이터**가 함께 있어 env 없거나 노션 비어있으면 fallback 사용. 노션 데이터 있으면 그쪽 우선.

| 노션 DB | Fallback 위치 |
|---|---|
| Mentoring | `src/data/mentoring.ts` `fallbackPrograms` |
| Reviews | `src/data/mentoring.ts` `fallbackReviews` (현재 빈 배열) |
| Cohorts | `src/data/cohort.ts` `fallbackCohort` (1기 정보) |

### 운영 워크플로

| 작업 | 어디서 |
|---|---|
| 새 글 발행 | `src/content/writing/{slug}.md` 추가 → 커밋 → Vercel 자동 배포 |
| 프로그램 가격·내용 수정 | 노션 Mentoring DB에서 수정 → Vercel "Redeploy" 클릭 |
| 후기 노출 on/off | 노션 Reviews DB의 "후기를 마케팅..." 체크박스 → Redeploy |
| 새 기수 시작 | 노션 Cohorts DB의 이전 행 Active 해제 + 새 행 추가 → Redeploy |

## 8. 알려진 이슈

### 로컬 TLS 인증서 체인 오류
- 증상: `self-signed certificate in certificate chain` (사용자 Mac에 TLS 가로채기)
- 원인 추정: 회사 VPN / 안티바이러스 / Cloudflare WARP 등
- **영향**:
  - `@astro-notion/loader`(node-fetch v2) → **실패** → 로컬 dev/build에서 노션 데이터 못 가져옴
  - `@notionhq/client` 직접 호출(Node 24 native fetch + macOS keychain) → **성공** → seed 스크립트 정상 작동
- **해결**: Vercel 배포 환경에서는 TLS 가로채기 없으니 자연히 해결됨
- **대안**: 로컬에서도 노션 데이터 보려면 TLS 가로채는 소프트웨어 임시 중지 (또는 NODE_EXTRA_CA_CERTS에 회사 CA 추가)

### npm scripts
- `npm run dev` — `--use-openssl-ca` 옵션. 정상 네트워크에서 작동
- `npm run dev:notls` — `NODE_TLS_REJECT_UNAUTHORIZED=0`. 보안 위험으로 권장 X, 응급 시만

## 9. 보안 메모

- `.env` (gitignored) → 실제 토큰. 절대 커밋 X
- `.env.example` → 템플릿, git에 올라감
- 한 번 .env.example에 토큰 실수로 들어갔으나 git repo 아니라서 푸시 안 됨. 즉시 정리 완료
- 토큰 노출 의심 시 노션 integration 페이지에서 rotate

## 10. 다음 세션 할 일 (우선순위)

### A. Vercel + GitHub 배포 (가장 큰 다음 단계)
1. GitHub 계정 확인 — 이 프로젝트는 **`iammejin` 개인 계정**
   - `gh auth status`로 활성 계정 확인
   - 커밋 시 `GIT_AUTHOR_EMAIL=iammejin@gmail.com` env로 강제 (글로벌 git config는 회사 이메일이라 사고 방지)
2. `olivia-site/`에서 `git init` + GitHub repo 생성 + push
3. Vercel 프로젝트 연결 (Framework: Astro 자동 감지)
4. 환경변수 추가: `NOTION_TOKEN` / `NOTION_MENTORING_DB_ID` / `NOTION_REVIEWS_DB_ID` / `NOTION_COHORTS_DB_ID`
5. Preview URL 확인 → 노션 데이터 흘러오는지 검증
6. 도메인 `productmanager-olivia.com` Vercel에 연결 (Cloudflare DNS)

### B. Cohorts DB 셋업 (사용자 측 작업)
1. 노션에서 Cohorts DB 생성 (스키마는 `.env.example` 또는 위 6번 참고)
2. DB 우측 ⋯ → Connections → "Olivia Site" integration 추가
3. DB URL에서 32자 hex ID 복사 → `.env`에 `NOTION_COHORTS_DB_ID=...`
4. `cd olivia-site && node scripts/seed-cohorts-db.mjs` 실행

### C. 이미지 자산 교체
- `public/images/olivia-portrait.jpg` — Hero·About 프로필 사진
- `public/images/og-default.png` — SNS 공유 (1200×630)
- 책 표지 이미지 — ebook 페이지

### D. Footer 법적 페이지 (결제 받는 사이트 필수)
- `/legal/terms` 이용약관
- `/legal/privacy` 개인정보처리방침
- `/legal/refund` 환불 규정

### E. 콘텐츠 마이그레이션 (사용자 작업)
- 브런치 14개 글 → `src/content/writing/`로 마크다운 이전
- AI 노션 2개 글 함께
- 첫 글 후보: "관광경영학과 출신이 PM 팀장 된 이야기" (현재 draft:true 샘플로 존재)

### F. 자잘한 디테일
- 모바일 햄버거 메뉴 (필요시)
- Writing 글에 cover 이미지 schema 추가 (옵션)
- Vercel deploy hook → 노션 자동 트리거 (옵션 C, 굳이 필요할 때만)
- Footer에 사업자 정보 (사업자등록 후)

## 11. 디렉토리 구조

```
olivia-site/
├─ src/
│  ├─ pages/
│  │  ├─ index.astro · about.astro · mentoring.astro · ebook.astro · contact.astro
│  │  ├─ rss.xml.ts
│  │  └─ writing/{index,[...slug],tags/[tag]}.astro
│  ├─ layouts/BaseLayout.astro
│  ├─ components/{ui,site,sections,mentoring,writing}/
│  ├─ content/writing/
│  │  ├─ sample-pm-career.md (draft:true)
│  │  └─ sample-pm-career/order-flow.svg
│  ├─ content.config.ts (4 collections)
│  ├─ data/{site,work,mentoring,cohort}.ts
│  └─ styles/{tokens,base,fonts,prose,global}.css
├─ scripts/
│  ├─ seed-mentoring-db.mjs (idempotent)
│  └─ seed-cohorts-db.mjs (idempotent)
├─ public/
│  ├─ fonts/PretendardVariable.woff2
│  ├─ images/ (placeholder, 실제 파일로 교체 필요)
│  ├─ favicon.{svg,ico}
│  └─ robots.txt
├─ .env (gitignored, 실제 시크릿)
├─ .env.example (git 템플릿, 셋업 가이드 포함)
├─ astro.config.mjs (sitemap + rehype-figure)
├─ tsconfig.json
└─ package.json (dev / dev:notls / build / build:notls / preview)
```

## 12. 외부 링크 / 식별자 (data/site.ts)

| 항목 | 값 |
|---|---|
| Email | `iammejin@gmail.com` |
| Instagram | `@pm_mejin` |
| Brunch | `@olivia200a` |
| eBook | `https://litt.ly/mejin/sale/RBa4E8c` |
| 멘토링 신청 폼 | `https://www.notion.so/370ee2313e8b43c6939e9f0256343f91` |

## 13. 자주 쓰는 명령어

```bash
cd olivia-site

# 개발 서버
npm run dev               # http://localhost:4321

# 빌드
npm run build             # dist/ 생성

# Notion DB 시드 (멱등)
node scripts/seed-mentoring-db.mjs
node scripts/seed-cohorts-db.mjs

# Astro CLI
npm run astro -- --help
```

## 14. 신청 절차 (사이트 표시 내용)

1. 신청 완료
2. 입금 완료 및 사전 질문 요청
3. 일정 확정 및 사전 답변 전달 완료
4. 멘토링 완료

입금 계좌: 국민은행 884202-04-154725 김혜진

환불 규정:
- 확정 메일 전달 이전 취소: 50% 환불
- 사전 질문지 답변 전달 이후: 환불 불가
- 멘토링 24시간 전까지 일정 변경 1회 가능 / 노쇼 시 환불 불가
