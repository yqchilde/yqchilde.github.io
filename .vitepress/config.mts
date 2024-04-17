import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "程序员YY",
  description: "程序员YY,yqchilde,程序员,Gopher,热爱技术,中度强迫症,熬夜达人",
  lang: 'zh-CN',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    search: {
      provider: 'local'
    },
    outline: {
      label: "页面导航",
    },
    nav: [
      { text: '首页', link: '/' },
      {
        text: "奇技淫巧",
        items: [
          {
            text: "工具篇",
            link: "/tips/tools/"
          }
        ]
      },
      { text: '示例', link: '/markdown-examples' },
      {
        text: '网站相关',
        items: [
          {
            text: '关于博主',
            link: '/website/about'
          }
        ]
      }
    ],

    // sidebar: [
    // {
    //   text: 'Examples',
    //   items: [
    //     { text: 'Markdown Examples', link: '/markdown-examples' },
    //     { text: 'Runtime API Examples', link: '/api-examples' }
    //   ]
    // },



    // {
    //   text: '关于',
    //   items: [
    //     { text: '关于', link: '/about' }
    //   ]
    // },
    // ],

    sidebar: {
      '/tips/': [
        {
          text: "奇技淫巧",
          items: [
            {
              text: '工具篇',
              link: '/tips/tools/',
              items: [
                { text: '如何使用 Karabiner 来代替 Capslox 的体验', link: '/tips/tools/capslox-karabiner' }
              ]
            },
            { text: '语言篇', link: '/tips/langs/' }
          ]
        }
      ],
      '/website/': [
        {
          text: "网站相关",
          items: [
            { text: '关于博主', link: '/website/about' }
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yqchilde' }
    ],

    footer: {
      copyright: 'Copyright © 2019-2024 程序员YY | CC BY-NC 4.0 |  <a href="https://beian.miit.gov.cn" target="_blank" rel="nofollow noopener">晋ICP备18003223号-2</a>'
    }
  }
})
