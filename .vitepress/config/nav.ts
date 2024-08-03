import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
    {
        text: '导航',
        link: '/nav',
    },
    {
        text: "博客",
        link: '/blog',
        activeMatch: '^/blog',
    },
    {
        text: "后端纪事",
        activeMatch: '^/review',
        items: [
            { text: "Golang篇", link: "/review/golang/map" },
            { text: "Python篇", link: "/review/python/pyside6" },
            { text: "Redis篇", link: "/review/redis/interview-1" },
        ]
    },
    {
        text: "定制软件",
        activeMatch: '^/softs',
        items: [
            { text: "OpenAI", link: "/softs/openai" },
        ]
    },
    {
        text: 'Workflow',
        items: [
            {
                items: [
                    { text: '编程规范', link: '/workflow/style-guide' },
                ]
            },
            {
                items: [
                    { text: '常用正则整理', link: '/workflow/utils/regexp' },
                    { text: '常用代码片段', link: '/workflow/utils/snippets' }
                ]
            },
            {
                items: [
                    { text: 'Git 命令清单', link: '/workflow/git/command' },
                    { text: 'Git 常用命令', link: '/workflow/git/common-command' },
                ]
            },
        ],
        activeMatch: '^/workflow'
    },
    {
        text: '提效工具',
        items: [
            {
                text: '软件推荐与配置',
                items: [
                    { text: 'Mac 平台', link: '/efficiency/mac/surge' },
                    { text: 'Windows 平台', link: '/efficiency/windows/keymap' },
                ]
            },
        ],
        activeMatch: '^/efficiency'
    },
    {
        text: 'Feeds',
        link: '/feeds-sub'
    },
    {
        text: 'About',
        link: '/about'
    }
]
