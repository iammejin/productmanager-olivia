// 멘토링 기수 정보 — fallback 정적 데이터.
// 노션 Cohorts DB에 Active=true 행이 있으면 그쪽이 우선 사용된다.
// (mentoring.astro 참고)
//
// 노션 연동을 안 쓰는 경우: 새 기수 시작할 때 이 파일만 갱신하고 커밋하면 됨.

export type Cohort = {
  number: number;
  startDate: string;        // "YYYY.MM.DD"
  endDate: string;
  applicationDeadline?: string;
  maxSlots: number;
  isOpen: boolean;
};

export const fallbackCohort: Cohort = {
  number: 1,
  startDate: "2026.05.11",
  endDate: "2026.05.31",
  applicationDeadline: "2026.05.08",
  maxSlots: 5,
  isOpen: true,
};

// 입금 정보 (계좌이체 받을 계좌).
// 사업자 등록 + PG 도입 시 제거 예정.
export const paymentInfo = {
  bankName: "국민은행",
  accountNumber: "884202-04-154725",
  accountHolder: "김혜진",
  note: "입금자명은 신청자 이름과 동일하게 부탁드립니다.",
};

// 환불 규정.
export const refundPolicy = [
  "확정 메일 전달 이전 취소: 50% 환불",
  "사전 질문지 답변 전달 이후: 환불 불가",
  "멘토링 24시간 전까지 일정 변경 1회 가능 / 노쇼 시 환불 불가",
];

// 신청 절차 단계.
export const applicationSteps = [
  "신청 완료",
  "입금 완료 및 사전 질문 요청",
  "일정 확정 및 사전 답변 전달 완료",
  "멘토링 완료",
];

// 진행 방식 설명.
export const sessionFormat = [
  "60분 1:1 비대면 멘토링 (Google Meet)",
  "양측 모두 녹화·녹취·외부 송출 금지",
  "신청 시 작성한 사전 질문을 바탕으로 진행",
  "멘토링 후 24시간 내 노션 정리본 발송 (액션 아이템 + 추천 자료)",
  "해당 기수 운영 기간 동안 오픈채팅 상담 피드백",
];
