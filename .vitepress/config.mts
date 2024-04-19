import { defineConfig } from 'vitepress';
import { themeConfig } from './config.theme';
import { metaData } from './config.metadata';
import { markdown } from './config.markdown';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 基础配置
  lang: metaData.lang,
  title: metaData.title,
  description: metaData.description,

  // 最后更新时间
  lastUpdated: true,

  // 简洁的url
  cleanUrls: true,

  // 主题配置
  themeConfig,

  // markdown配置
  markdown: markdown,

  // 路由重写
  rewrites: {
    ":postsdir/:categorie/:dd/:title/README.md": ":postsdir/:categorie/:title.md",
    ":pagesdir/:title.md": ":title.md",
  },

  srcExclude: [
    "./.github/",
    "./README.md",
  ],
})
