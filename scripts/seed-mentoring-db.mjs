// One-shot script to seed the Notion Mentoring DB with the 3 MVP programs.
//
// Idempotent: skips rows where Slug already exists.
// Reads NOTION_TOKEN, NOTION_MENTORING_DB_ID from olivia-site/.env.
//
// Run from olivia-site/:
//   node scripts/seed-mentoring-db.mjs
//
// If your local network has TLS interception (corporate VPN, antivirus),
// the API call will fail with "self-signed certificate in certificate chain".
// In that case, run from a different machine or temporarily disable the
// intercepting tool. Vercel build env does NOT have this issue.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Client } from "@notionhq/client";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env manually (no extra deps) ───────────────────────
function loadEnv(path) {
  const content = readFileSync(path, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(resolve(__dirname, "../.env"));

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.env.NOTION_MENTORING_DB_ID;

if (!NOTION_TOKEN || !DB_ID) {
  console.error("Missing NOTION_TOKEN or NOTION_MENTORING_DB_ID in .env");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// ─── Programs to insert ───────────────────────────────────────
const programs = [
  {
    slug: "coffee-chat",
    title: "현직자 커피챗",
    subtitle: "IT업계 커리어·취업·실무 고민 1:1 상담",
    price: 50000,
    duration: "60분",
    bullets: [
      "PM 취업 준비 전략",
      "신입/인턴 고민 상담",
      "커리어 고민 상담",
      "현직 PM 실무 이야기",
    ],
    badge: "",
    externalLinkLabel: "",
    externalLinkUrl: null,
    order: 1,
    active: true,
  },
  {
    slug: "portfolio-consulting",
    title: "포트폴리오 1:1 컨설팅",
    subtitle: "지원 직무 JD 분석 + 포트폴리오 개선 가이드",
    price: 90000,
    duration: "60분",
    bullets: [
      "60분 1:1로 포트폴리오를 함께 보며 방향을 잡습니다",
      "1개 채용공고 기준 진행 (신청 이후 포지션 상담 가능)",
    ],
    badge: "",
    externalLinkLabel: "",
    externalLinkUrl: null,
    order: 2,
    active: true,
  },
  {
    slug: "portfolio-ebook-package",
    title: "포트폴리오 + 전자책 패키지",
    subtitle: "포트폴리오 컨설팅 + 면접관에게 듣는 합격 포트폴리오 전자책 제공",
    price: 120000,
    duration: "60분",
    bullets: [
      "포트폴리오 1:1 컨설팅 전체 포함",
      "「면접관에게 듣는 합격 포트폴리오」 전자책 제공",
    ],
    badge: "BEST",
    externalLinkLabel: "전자책 보러가기",
    externalLinkUrl: "https://litt.ly/mejin/sale/RBa4E8c",
    order: 3,
    active: true,
  },
];

// ─── Notion property helpers ──────────────────────────────────
const t = (content) => ({ title: [{ text: { content: content || "" } }] });
const rt = (content) =>
  content ? { rich_text: [{ text: { content } }] } : { rich_text: [] };
const num = (value) => ({ number: value ?? null });
const urlProp = (value) => ({ url: value ?? null });
const check = (value) => ({ checkbox: !!value });

// ─── Check if Slug already exists ─────────────────────────────
async function findExistingBySlug(slug) {
  const res = await notion.databases.query({
    database_id: DB_ID,
    filter: { property: "Slug", rich_text: { equals: slug } },
    page_size: 1,
  });
  return res.results[0] ?? null;
}

// ─── Main ────────────────────────────────────────────────────
async function main() {
  console.log(`Seeding Notion Mentoring DB (${DB_ID})...`);
  console.log(`Programs to insert: ${programs.length}\n`);

  for (const p of programs) {
    try {
      const existing = await findExistingBySlug(p.slug);
      if (existing) {
        console.log(`[skip] ${p.slug} — already exists (page ${existing.id})`);
        continue;
      }

      const properties = {
        Title: t(p.title),
        Slug: rt(p.slug),
        Price: num(p.price),
        "Original Price": num(undefined),
        Duration: rt(p.duration),
        Subtitle: rt(p.subtitle),
        Bullets: rt(p.bullets.join("\n")),
        Badge: rt(p.badge),
        "External Link Label": rt(p.externalLinkLabel),
        "External Link Url": urlProp(p.externalLinkUrl),
        Order: num(p.order),
        Active: check(p.active),
      };

      const result = await notion.pages.create({
        parent: { database_id: DB_ID },
        properties,
      });

      console.log(`[insert] ${p.slug} → ${result.id}`);
    } catch (err) {
      console.error(`[fail] ${p.slug}:`, err.message || err);
      if (err.code === "validation_error") {
        console.error(
          "  Hint: column name/type mismatch. Verify DB schema matches .env.example."
        );
      }
      process.exitCode = 1;
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
