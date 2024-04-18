import type { DefaultTheme } from 'vitepress';

export const themeConfig: DefaultTheme.Config = {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
        label: "页面导航",
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
        provider: 'local'
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
    },
    // @ts-ignore
    articleMetadataConfig: {
        author: 'YY', // 文章全局默认作者名称
        authorLink: '/about/me', // 点击作者名时默认跳转的链接
    },
}