// Fallback static data for mentoring programs.
// Notion DB data takes precedence when configured (see content.config.ts).
// Update this file when programs change AND Notion DB isn't connected.

export type MentoringProgram = {
  slug: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  durationMinutes?: number;
  monthlySlots?: number;
  badge?: string;
  bullets: string[];
  externalLinkLabel?: string;
  externalLinkHref?: string;
  order?: number;
};

export const fallbackPrograms: MentoringProgram[] = [
  {
    slug: "coffee-chat",
    title: "현직자 커피챗",
    subtitle: "IT업계 커리어·취업·실무 고민 1:1 상담",
    price: 50_000,
    monthlySlots: 5,
    bullets: [
      "PM 취업 준비 전략",
      "신입/인턴 고민 상담",
      "커리어 고민 상담",
      "현직 PM 실무 이야기",
    ],
    order: 1,
  },
  {
    slug: "portfolio-consulting",
    title: "포트폴리오 1:1 컨설팅",
    subtitle: "지원 직무 JD 분석 + 포트폴리오 개선 가이드",
    price: 90_000,
    durationMinutes: 60,
    monthlySlots: 5,
    bullets: [
      "60분 1:1로 포트폴리오를 함께 보며 방향을 잡습니다",
      "1개 채용공고 기준 진행 (신청 이후 포지션 상담 가능)",
    ],
    order: 2,
  },
  {
    slug: "portfolio-ebook-package",
    title: "포트폴리오 + 전자책 패키지",
    subtitle: "포트폴리오 컨설팅 + 면접관에게 듣는 합격 포트폴리오 전자책",
    price: 120_000,
    durationMinutes: 60,
    monthlySlots: 5,
    badge: "BEST",
    bullets: [
      "포트폴리오 1:1 컨설팅 전체 포함",
      "「면접관에게 듣는 합격 포트폴리오」 전자책 제공",
    ],
    externalLinkLabel: "전자책 미리보기",
    externalLinkHref: "https://litt.ly/mejin/sale/RBa4E8c",
    order: 3,
  },
];

export type Review = {
  id: string;
  quote: string;
  author: string;
  authorMeta?: string;
  program?: string;
  date?: Date;
  featured?: boolean;
  order?: number;
};

export const fallbackReviews: Review[] = [];

export function formatKrw(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}
