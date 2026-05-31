export const siteConfig = {
  domain: "productmanager-olivia.com",
  url: "https://productmanager-olivia.com",
  logoText: "olivia.",
  authorEn: "Olivia",
  authorKo: "김혜진",
  instagramHandle: "@pm_mejin",
  linkedinName: "혜진 김",
  email: "iammejin@gmail.com",
  description:
    "Product Manager 김혜진의 작업 아카이브. 명확한 목적을 바탕으로 서비스의 확장성과 조직의 시스템을 구조적으로 설계해온 13년차 PM의 글과 실무 인사이트.",
  defaultOgImage: "/images/og-default.png",
} as const;

export type NavItem = {
  href: string;
  label: string;
  key: "home" | "writing" | "about" | "mentoring" | "ebook";
};

export const nav: NavItem[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/writing", label: "Posts", key: "writing" },
  { href: "/about", label: "About", key: "about" },
  { href: "/ebook", label: "eBook", key: "ebook" },
];

export const externalLinks = {
  instagram: "https://www.instagram.com/pm_mejin",
  linkedin: "https://www.linkedin.com/in/%ED%98%9C%EC%A7%84-%EA%B9%80-a4698b95/",
  ebook: "https://litt.ly/mejin/sale/RBa4E8c",
  mentoringForm: "https://www.notion.so/370ee2313e8b43c6939e9f0256343f91",
} as const;
