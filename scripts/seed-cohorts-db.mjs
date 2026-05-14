// One-shot script to seed the Notion Cohorts DB with the current cohort.
//
// Idempotent: skips rows where Number already exists.
// Reads NOTION_TOKEN, NOTION_COHORTS_DB_ID from olivia-site/.env.
//
// Run from olivia-site/:
//   node scripts/seed-cohorts-db.mjs
//
// 새 기수 추가: cohorts 배열에 새 객체 추가 후 다시 실행. 기존 행은 자동 skip.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Client } from "@notionhq/client";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const DB_ID = process.env.NOTION_COHORTS_DB_ID;

if (!NOTION_TOKEN || !DB_ID) {
  console.error("Missing NOTION_TOKEN or NOTION_COHORTS_DB_ID in .env");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// ─── Cohorts to insert ────────────────────────────────────────
// 새 기수 추가 시: 새 객체를 이 배열에 추가하고 스크립트 재실행.
// Active=true는 동시에 1개만! (사이트가 첫 Active 행을 사용)
const cohorts = [
  {
    title: "1기",
    number: 1,
    startDate: "2026-05-11",        // ISO format (YYYY-MM-DD)
    endDate: "2026-05-31",
    applicationDeadline: "2026-05-08",
    maxSlots: 5,
    isOpen: true,
    active: true,
  },
];

// ─── Notion property helpers ──────────────────────────────────
const t = (content) => ({ title: [{ text: { content: content || "" } }] });
const num = (value) => ({ number: value ?? null });
const dateProp = (value) => (value ? { date: { start: value } } : { date: null });
const check = (value) => ({ checkbox: !!value });

async function findExistingByNumber(number) {
  const res = await notion.databases.query({
    database_id: DB_ID,
    filter: { property: "Number", number: { equals: number } },
    page_size: 1,
  });
  return res.results[0] ?? null;
}

async function main() {
  console.log(`Seeding Notion Cohorts DB (${DB_ID})...`);
  console.log(`Cohorts to insert: ${cohorts.length}\n`);

  for (const c of cohorts) {
    try {
      const existing = await findExistingByNumber(c.number);
      if (existing) {
        console.log(`[skip] ${c.title} — already exists (page ${existing.id})`);
        continue;
      }

      const properties = {
        Title: t(c.title),
        Number: num(c.number),
        "Start Date": dateProp(c.startDate),
        "End Date": dateProp(c.endDate),
        "Application Deadline": dateProp(c.applicationDeadline),
        "Max Slots": num(c.maxSlots),
        "Is Open": check(c.isOpen),
        Active: check(c.active),
      };

      const result = await notion.pages.create({
        parent: { database_id: DB_ID },
        properties,
      });

      console.log(`[insert] ${c.title} → ${result.id}`);
    } catch (err) {
      console.error(`[fail] ${c.title}:`, err.message || err);
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
