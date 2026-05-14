# productmanager-olivia.com — 운영 가이드

> 이 파일은 Claude Code가 이 프로젝트에서 작업할 때 자동으로 로드되는 운영 지침이다.
> 사이트의 초기 구축 컨텍스트(전체 페이지/컴포넌트 인벤토리, 노션 DB 스키마 등)는 [HANDOFF.md](./HANDOFF.md) 참고.

## 프로젝트 한줄 요약

김혜진(Olivia / @pm_mejin)의 1인 PM 인플루언서 사이트. Astro + Notion hybrid CMS, Vercel 배포, 라이브.

- **라이브 URL**: https://productmanager-olivia.com
- **GitHub repo**: `iammejin/productmanager-olivia` (main 브랜치)
- **Vercel 프로젝트**: `productmanager-olivia` (iammejin-7062's projects)

---

## 🚨 절대 규칙 (Hard Rules)

### 1. iammejin 개인 계정으로만 작업
- 사용자는 GitHub 계정 2개 사용: 회사용 `hyejin.kim` / 개인용 `iammejin`
- 이 프로젝트는 **무조건 `iammejin` 계정**. 회사 이메일이 public repo에 노출되면 안 됨.
- **모든 git/gh 작업 전 `gh auth status`로 활성 계정 확인 필수**
- 글로벌 `git config user.email`은 회사 이메일(`hyejin.kim@woowahan.com`)이라 사고 위험 → 로컬 config로 `iammejin@gmail.com` 이미 지정됨
- 새 커밋 시 `git log -1 --format="%ae"`로 작성자 이메일 검증 권장

### 2. 블로그 글 발행 워크플로우 엄수
- 사용자가 **명시적으로 "발행해줘"라고 말하기 전까지** `src/content/writing/`에 파일 추가 금지
- 옵시디언 vault에서 `draft: true`인 글은 절대 사이트로 복사하지 않음
- 자세한 절차는 아래 "운영 워크플로우" 섹션 참고

### 3. .env 절대 커밋 금지
- `.env`는 `.gitignore`에 포함됨. 토큰이 들어있음.
- 커밋 전 항상 `git status`로 .env가 staged되지 않았는지 확인

### 4. Framework Preset 변경 금지
- Vercel 프로젝트 설정에서 Framework Preset은 **Astro** 고정
- 과거에 Next.js로 잘못 설정되어 빌드 실패한 사고 있음

---

## 📂 핵심 경로

### 옵시디언 vault (사용자가 글 쓰는 곳)
```
/Users/hyejin.kim/Library/Mobile Documents/com~apple~CloudDocs/obsidian/Hyejin/Hyejin/
├─ 블로그/                  ← 새 글 저장 위치
└─ Templates/블로그글.md   ← frontmatter 템플릿
```
⚠️ iCloud Drive 동기화 폴더. 심볼릭 링크 사용 금지 (사고 위험).

### 사이트 repo
```
/Users/hyejin.kim/Projects/mentoring site dev/olivia-site/
└─ src/content/writing/    ← 발행된 markdown 글 위치
```

---

## 🔁 운영 워크플로우

### A. 블로그 글 작성 (사용자가 "블로그 글 써줘"라고 할 때)

1. **반드시 옵시디언 vault에만 작성**: `Hyejin/Hyejin/블로그/<영문슬러그>.md`
2. **frontmatter는 Templates/블로그글.md 구조 따름**:
   ```yaml
   ---
   title: "글 제목"
   description: "한 줄 설명 (선택)"
   date: 2026-05-14
   tags: ["태그1", "태그2"]
   cover: ""        # 대표 이미지 URL 또는 /images/posts/<slug>-cover.jpg
   coverAlt: ""     # 대표 이미지 설명 (검색엔진/접근성용)
   draft: true   # 항상 true로 작성 — 사용자가 검수 후 직접 false로 변경
   ---
   ```
3. **draft: true 필수** — 검수 전엔 절대 사이트에 안 올라가도록 안전장치
4. **파일명(슬러그)은 영문 권장** — 한글이면 URL 인코딩되어 못생김
5. 사이트 repo는 건드리지 않음. git 명령도 실행 안 함.

#### 대표 이미지(cover) 처리 두 가지 패턴

- **패턴 A (외부 URL)**: 호스팅된 이미지 URL을 그대로 적는다. 브런치 CDN, Unsplash, GitHub raw 등.
  ```yaml
  cover: "https://images.unsplash.com/photo-abc"
  coverAlt: "사무실에 앉아 노트북을 보는 사람"
  ```
- **패턴 B (사이트 자산)**: 직접 만든 이미지를 사이트에 함께 관리. 발행 시 이미지 파일을 `olivia-site/public/images/posts/<slug>-cover.jpg`로 같이 복사하고 frontmatter에는 `/images/posts/<slug>-cover.jpg`로 적는다.
  ```yaml
  cover: "/images/posts/career-reset-journal-cover.jpg"
  coverAlt: "노트와 펜이 놓인 책상"
  ```

옵시디언 본문에 드래그한 `![[...]]` 위키링크 이미지는 사이트에서 동작하지 않음 — 반드시 frontmatter의 `cover` 필드에 위 두 가지 형태 중 하나를 적어야 목록/상세/태그 페이지에 대표 이미지가 노출된다.

### B. 블로그 글 발행 (사용자가 "발행해줘"라고 할 때)

발행 절차는 다음 순서로 실행:

```bash
# 1. 안전 체크
gh auth status                                  # iammejin 활성 확인
cd "olivia-site" && git config --local user.email  # iammejin@gmail.com 확인

# 2. vault의 draft:false인 글들을 site repo로 복사
#    (draft:true인 글은 절대 복사하지 않음)
cp "/Users/hyejin.kim/Library/Mobile Documents/com~apple~CloudDocs/obsidian/Hyejin/Hyejin/블로그/<slug>.md" \
   "src/content/writing/"

# 2-1. cover가 패턴 B(사이트 자산)인 경우 이미지 파일도 같이 복사
#      예: cp "<원본 이미지>" "public/images/posts/<slug>-cover.jpg"

# 3. 커밋 + 푸시
git add src/content/writing/
git commit -m "Publish: <글 제목>"
git push

# 4. Vercel 자동 배포 (1-2분)
# 5. https://productmanager-olivia.com/writing/<slug> 로 라이브 확인 (curl)
```

### C. 노션 DB 데이터 변경 시 (멘토링 프로그램, 후기, 기수)

- 노션 DB에서 직접 수정 → **Vercel "Redeploy" 클릭 필요** (빌드 타임에만 노션 호출)
- 자동 webhook 없음. 수동 트리거.

---

## 🔑 환경변수 (Vercel)

```
NOTION_TOKEN              = ntn_***   (notion integration secret)
NOTION_MENTORING_DB_ID    = 4f33e3d46c1f46fa89dfad8cf6070ca2
NOTION_REVIEWS_DB_ID      = be25bd5693984cf98624a8016e9f0143
NOTION_COHORTS_DB_ID      = (아직 미설정 — Cohorts DB 생성 시 추가)
```
- 빈 값 등록하면 Vercel UI가 validation 에러 (Value is required) — 변수 자체를 삭제해야 함
- 코드는 모두 fallback 처리: env var 없으면 정적 fallback 데이터 사용

---

## ⚠️ 알려진 이슈

### 로컬 빌드에서 노션 데이터 못 가져옴 — **정상**
- 증상: `npm run dev/build` 시 `self-signed certificate in certificate chain` 에러
- 원인: 사용자 Mac의 TLS 가로채기 (회사 VPN/안티바이러스 등)
- 영향: 로컬에서는 fallback 데이터로 동작 → 정상
- 해결: Vercel 빌드 환경에서는 문제없음. 디버깅 불필요.

---

## 🛠 자주 쓰는 명령어

```bash
cd "olivia-site"

# 개발
npm run dev                        # http://localhost:4321 (fallback 데이터 사용)
npm run build                      # 빌드 검증

# Notion DB seed (멱등)
node scripts/seed-mentoring-db.mjs
node scripts/seed-cohorts-db.mjs   # Cohorts DB 생성 후

# 라이브 사이트 헬스 체크
curl -sI https://productmanager-olivia.com | head -3
curl -s https://productmanager-olivia.com/writing | grep -oE "<h[23][^>]*>[^<]+</h[23]>"

# 발행된 글 목록
ls src/content/writing/*.md
```

---

## 🔗 외부 링크 / 식별자

| 항목 | 값 |
|---|---|
| Email | iammejin@gmail.com |
| Instagram | @pm_mejin |
| Brunch | @olivia200a |
| eBook 판매 | https://litt.ly/mejin/sale/RBa4E8c |
| 멘토링 신청 폼 | https://www.notion.so/370ee2313e8b43c6939e9f0256343f91 |
| 입금 계좌 | 국민은행 884202-04-154725 김혜진 |

---

## 🎨 디자인 가드레일 (위반 금지)

- 강조 주황 `#FF6B1A` — 면적의 **1–3%만** 사용 (라벨, 포인트 단어, 마침표만)
- `box-shadow` ❌
- `gradient` ❌
- `border-radius > 4px` ❌
- pill 버튼 ❌
- 한국어 본문 `line-height: 1.75` 고정

전체 디자인 토큰: `src/styles/tokens.css`

---

## 📋 남은 작업 (우선순위)

1. **Cohorts 노션 DB 생성** + `NOTION_COHORTS_DB_ID` 추가 (사용자 작업)
2. **이미지 자산 교체** — 프로필 사진(Hero/About), OG 이미지 1200×630, 전자책 표지
3. **Footer 법적 페이지** — 약관 / 개인정보처리방침 / 환불규정 (결제 받는 사이트 필수)
4. **콘텐츠 마이그레이션 마무리** — 브런치 #11, #12 본문 추출(사용자 도움 필요), 옵시디언 검수 중인 8개 글 발행
