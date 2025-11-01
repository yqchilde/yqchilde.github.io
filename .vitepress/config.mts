import { defineConfig } from 'vitepress'
import { head } from './config/head.js'
import { nav } from './config/nav.js'
import { sidebar } from './config/sidebar.js'
import { markdown } from './config/markdown.js'
import { metaData } from './config/metadata.js'
import { algolia } from './config/algolia.js'
import fg from 'fast-glob'
import path from 'path'

// 生成URL重写规则，去掉标题中的数字前缀
function generateRewrites() {
  const rewrites: Record<string, string> = {}
  
  // 处理posts目录下的文件
  const postFiles = fg.sync('posts/**/*/README.md', { cwd: process.cwd() })
  
  postFiles.forEach((file: string) => {
    const parts = file.split('/')
    if (parts.length >= 4) {
      const categorie = parts[1]
      const yyyy = parts[2]
      const titleDir = parts[3]
      
      // 去掉数字前缀 (如 "1-xxx" -> "xxx", "2-yyy" -> "yyy")
      const cleanTitle = titleDir.replace(/^\d+-/, '')
      
      // 原始路径 -> 清理后的路径
      rewrites[`posts/${categorie}/${yyyy}/${titleDir}/README.md`] = `${categorie}/${yyyy}/${cleanTitle}.md`
    }
  })
  
  return rewrites
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 基础配置
  head: head,
  lang: metaData.lang,
  title: metaData.title,
  description: metaData.description,

  // 最后更新时间
  lastUpdated: true,

  // 简洁的url
  cleanUrls: true,

  // 输出目录
  outDir: './dist',

  // 主题配置 https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    nav: nav,
    sidebar: sidebar,

    logo: {
      light: '/logo_light.svg',
      dark: '/logo_night.svg'
    },

    outline: {
      label: '页面导航',
      level: 'deep'
    },
    editLink: {
      pattern: 'https://github.com/yqchilde/MyNewBlog/edit/main/:path',
      text: '不妥之处，敬请雅正'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    search: {
      // provider: 'local'
      provider: 'algolia',
      options: algolia,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yqchilde/yqchilde.github.io' }
    ],
    footer: {
      copyright: 'Copyright © 2019-2025 YY\'s Blog | CC BY-NC 4.0 | <a href="https://beian.miit.gov.cn" target="_blank" rel="nofollow noopener" style="text-decoration: none;">晋ICP备18003223号-2</a> | <img src="/gongan.png" style="width: 12px; height: 12px; display: inline-block;"> <a href="https://beian.mps.gov.cn/#/query/webSearch?code=37011202002231" rel="noreferrer" target="_blank" style="text-decoration: none;">鲁公网安备37011202002231</a>'
    },
    // @ts-ignore
    articleMetadataConfig: {
      author: 'YY', // 文章全局默认作者名称
      authorLink: '/about', // 点击作者名时默认跳转的链接
    },
    // 自定义扩展: 文章版权配置
    copyrightConfig: {
      license: '署名-相同方式共享 4.0 国际 (CC BY-SA 4.0)',
      licenseLink: 'https://creativecommons.org/licenses/by/4.0/legalcode.zh-hans'
    },
  },

  // markdown配置
  markdown: markdown,

  // 路由重写
  rewrites: {
    // 自定义函数处理标题中的数字前缀
    ...generateRewrites(),
    'posts/:categorie/:type/index.md': ':categorie/:type.md',
    'posts/:categorie/index.md': ':categorie.md',
    'pages/:categorie/index.md': ':categorie.md'
  },

  srcExclude: [
    './.github/',
    './README.md',
  ],

  sitemap: {
    hostname: 'https://yqqy.top',
  },
})
