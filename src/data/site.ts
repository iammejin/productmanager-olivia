export const siteConfig = {
  domain: "productmanager-olivia.com",
  url: "https://productmanager-olivia.com",
  logoText: "olivia.",
  authorEn: "Olivia",
  authorKo: "김혜진",
  instagramHandle: "@pm_mejin",
  brunchHandle: "@olivia200a",
  linkedinName: "혜진 김",
  email: "iammejin@gmail.com",
  description:
    "Product Manager 김혜진(Olivia)의 작업 아카이브. 13년차 PM이 서비스와 조직을 구조로 설계하며 쌓아온 글과 실무 인사이트.",
  defaultOgImage: "/images/og-default.png",
} as const;

export type NavItem = {
  href: string;
  label: string;
  key: "home" | "writing" | "about" | "mentoring" | "ebook" | "contact";
};

export const nav: NavItem[] = [
  { href: "/writing", label: "Writing", key: "writing" },
  { href: "/about", label: "About", key: "about" },
  { href: "/mentoring", label: "Mentoring", key: "mentoring" },
  { href: "/ebook", label: "eBook", key: "ebook" },
  { href: "/contact", label: "Contact", key: "contact" },
];

export const externalLinks = {
  instagram: "https://www.instagram.com/pm_mejin/",
  brunch: "https://brunch.co.kr/@olivia200a",
  linkedin: "https://www.linkedin.com/in/hyejin-kim",
  ebook: "https://litt.ly/mejin/sale/RBa4E8c",
  mentoringForm: "https://www.notion.so/370ee2313e8b43c6939e9f0256343f91",
} as const;
