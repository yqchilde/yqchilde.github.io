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
        text: "后端笔记",
        activeMatch: '^/review',
        items: [
            { text: "Golang篇", link: "/review/golang/map" },
            { text: "Python篇", link: "/review/python/pyside6" },
            { text: "Redis篇", link: "/review/redis/interview-1" },
        ]
    },
    {
        text: "逆向笔记",
        activeMatch: '^/reverse-engineering',
        items: [
            { text: "JS逆向从入门到放弃", link: "/reverse-engineering/js" },
        ]
    },
    {
        text: "定制软件",
        activeMatch: '^/softs',
        items: [
            { text: "OpenAI", link: "/softs/openai" },
            { text: "Obsidian", link: "/softs/obsidian" },
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
                    { text: 'Git 多账户配置', link: '/workflow/git/multi-account' }
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
        text: 'FeedsSub',
        link: '/feeds-sub'
    },
    {
        text: 'About',
        link: '/about'
    }
]
