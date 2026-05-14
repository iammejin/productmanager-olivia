// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeFigure from "@microflash/rehype-figure";

export default defineConfig({
  site: "https://productmanager-olivia.com",
  output: "static",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeFigure],
  },
});
