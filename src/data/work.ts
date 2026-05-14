export type WorkRole = {
  title: string;
  description?: string;
  bullets: string[];
};

export type WorkCompany = {
  company: string;
  position: string;
  period: string;
  durationNote?: string;
  intro: string;
  roles: WorkRole[];
};

export const workCompanies: WorkCompany[] = [
  {
    company: "우아한형제들 (배달의민족)",
    position: "Senior Product Manager · Team Lead",
    period: "2020.11 – 현재",
    durationNote: "5년+",
    intro:
      "일 200만 건 이상의 주문 트래픽이 흐르는 주문·배달 중계 플랫폼을 담당합니다. 푸드/커머스/픽업 등 파편화된 주문 데이터를 통합하고, 대규모 트래픽에서도 안정적인 플랫폼을 기획하고 운영합니다.",
    roles: [
      {
        title: "Senior Product Manager",
        bullets: [
          "파편화된 주문 데이터를 단일 표준 스펙으로 통합한 '주문 중계 플랫폼' 구축. 도메인 간 강결합 구조를 해소하고 신규 도메인 연동 시 개발 리소스 30% 절감",
          "일 200만 건 트래픽 환경의 '주문 서킷브레이커' 고도화. 트래픽 처리 속도 20배, 응답 지연 84배 개선",
          "글로벌 딜리버리 플랫폼 통합 리딩. 배달 예측 정확도 80% 개선, 라이더 픽업 시간 오차 단축",
          "주문 Context 기반 인터넷 전화(mVoIP) 서비스 신규 구축. 안심번호 운영 비용 60% 절감, 내부 고객센터 문의 23% 감소",
          "LLM Agent 기반 사고형 챗봇 도입으로 파트너 문의 대응 자동화",
        ],
      },
      {
        title: "Team Lead (2022.04~)",
        bullets: [
          "스프린트·회고·업무 가이드라인 표준화 등으로 예측 가능한 협업 구조 확립",
          "분기 워크샵·정기 1:1 등으로 개인 커리어 목표와 조직 과제 정렬",
        ],
      },
    ],
  },
  {
    company: "야놀자 클라우드",
    position: "Product Manager",
    period: "2019.11 – 2020.11",
    durationNote: "1년",
    intro:
      "호텔·여행 O2O 플랫폼에서 업주향 서비스를 기획·운영했습니다. 호텔 채널 매니저(CM) B2B SaaS 영역의 서비스 구조 설계와 외부 연동(API·OTA)에 집중했습니다.",
    roles: [
      {
        title: "주요 업무",
        bullets: [
          "호텔 채널 매니저(CM) 구축 — 사용자/어드민 서비스 기획, 결제 PG 연동(이니시스, NICE, KRP)",
          "글로벌 프로젝트 — 해외 업주 대상 채널 매니저 서비스 구축",
          "OTA(Online Travel Agency)·LTA(Local Travel Agency) 파트너십 및 API 통합 리딩",
        ],
      },
    ],
  },
  {
    company: "산하정보기술 (現 야놀자 클라우드)",
    position: "Product Manager",
    period: "2016.04 – 2019.11",
    durationNote: "3년 7개월",
    intro:
      "호텔·여행 O2O 플랫폼에서 업주향 서비스를 기획·운영했습니다. 호텔 관리 시스템(PMS), 채널 매니저(CM), 온라인 통합 예약 시스템(CRS) 등 B2B SaaS 영역의 서비스 구조 설계와 외부 연동(API·결제·OTA)에 집중했습니다.",
    roles: [
      {
        title: "주요 업무",
        bullets: [
          "온라인 통합 예약 시스템(CRS) 구축 — 사용자/어드민 서비스 기획, 결제 PG 연동(이니시스, NICE, KRP)",
          "호텔 관리 서비스(PMS/CM) 리뉴얼 — 결제 단말기 VAN 연동(KICC, KIS), 서비스 설치 플로우 기획",
          "글로벌 프로젝트 — 해외 업주 대상 채널 매니저 서비스 구축",
          "OTA·LTA 파트너십 및 API 통합 리딩",
          "체크인/체크아웃 키오스크 데이터 기반 UX 개선",
        ],
      },
    ],
  },
  {
    company: "인터컨티넨탈 호텔 (IHG Korea)",
    position: "IT 운영",
    period: "2011.02 – 2012.12",
    durationNote: "1년 11개월",
    intro:
      "호텔 전산 시스템 구축 및 운영을 담당했습니다. 서비스–POS 연동, 자사 부킹 시스템과 호텔 시스템 연동을 통해 서비스 간 데이터 흐름이라는 PM의 기본기를 처음 익혔습니다.",
    roles: [],
  },
];
