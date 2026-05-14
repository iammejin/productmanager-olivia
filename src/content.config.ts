import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { notionLoader } from "@astro-notion/loader";

// ─── Markdown writing (always on) ──────────────────────────────
const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    canonical: z.string().url().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

// ─── Notion-backed collections (off when env missing) ──────────
//
// Set these env vars in .env to enable Notion sync:
//   NOTION_TOKEN              — Internal integration secret
//   NOTION_MENTORING_DB_ID    — Mentoring 프로그램 DB
//   NOTION_REVIEWS_DB_ID      — Reviews 후기 DB
//   NOTION_COHORTS_DB_ID      — Cohorts 기수 DB (Active 행이 현재 기수)
//
// Until they're set, pages fall back to static data
// (src/data/mentoring.ts, src/data/cohort.ts).
const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;
const NOTION_MENTORING_DB_ID = import.meta.env.NOTION_MENTORING_DB_ID;
const NOTION_REVIEWS_DB_ID = import.meta.env.NOTION_REVIEWS_DB_ID;
const NOTION_COHORTS_DB_ID = import.meta.env.NOTION_COHORTS_DB_ID;

const emptyLoader = (name: string) => ({
  name,
  load: async () => {},
});

const mentoring = defineCollection({
  loader:
    NOTION_TOKEN && NOTION_MENTORING_DB_ID
      ? notionLoader({
          auth: NOTION_TOKEN,
          database_id: NOTION_MENTORING_DB_ID,
          filter: {
            property: "Active",
            checkbox: { equals: true },
          },
          sorts: [{ property: "Order", direction: "ascending" }],
        })
      : emptyLoader("mentoring-empty"),
});

// Reviews DB는 폼 응답 기반이라 컬럼명이 길고 잘릴 수 있어서
// API 단계에서 filter/sort를 걸지 않고, mentoring.astro에서 prefix 매칭으로
// 처리한다. 잘못된 컬럼명으로 API 호출 실패하는 위험 회피.
const reviews = defineCollection({
  loader:
    NOTION_TOKEN && NOTION_REVIEWS_DB_ID
      ? notionLoader({
          auth: NOTION_TOKEN,
          database_id: NOTION_REVIEWS_DB_ID,
        })
      : emptyLoader("reviews-empty"),
});

// Cohorts DB: 기수 정보. Active=true인 행 1개를 현재 기수로 사용.
const cohorts = defineCollection({
  loader:
    NOTION_TOKEN && NOTION_COHORTS_DB_ID
      ? notionLoader({
          auth: NOTION_TOKEN,
          database_id: NOTION_COHORTS_DB_ID,
          filter: {
            property: "Active",
            checkbox: { equals: true },
          },
        })
      : emptyLoader("cohorts-empty"),
});

export const collections = { writing, mentoring, reviews, cohorts };
