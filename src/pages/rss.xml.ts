import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("writing", ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: `${siteConfig.authorKo}(${siteConfig.authorEn}) — Writing`,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>ko-kr</language>`,
  });
}
