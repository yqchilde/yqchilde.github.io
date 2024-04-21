import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
    {
        text: '导航',
        link: '/nav',
    },
    {
        text: "后端物语",
        activeMatch: '/review/',
        items: [
            { text: "Golang篇", link: "/review/golang" },
            { text: "Python篇", link: "/review/python" },
        ]
    },
    // {
    //     text: "源码阅读",
    //     items: [
    //         { text: "Golang", link: "/posts/backend/golang/" },
    //         { text: "PHP", link: "/posts/backend/php/" }
    //     ]
    // },
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
                    { text: '常用工具库整理', link: '/workflow/css/spec' },
                    { text: '常用正则整理', link: '/workflow/css/tricks' },
                    { text: '常用片段整理', link: '/workflow/sass/' }
                ]
            },
            {
                items: [
                    { text: '命令行工具', link: '/workflow/css/spec' },
                ]
            },
            {
                items: [
                    { text: 'Git 相关技巧', link: '/workflow/css/spec' },
                    { text: 'Git 命令清单', link: '/workflow/css/tricks' },
                ]
            },
        ],
        activeMatch: '^/workflow'
    },
    {
        text: "博客",
        link: '/blog',
        activeMatch: '/blog/',
    },
    {
        text: '提效工具',
        items: [
            {
                text: '软件推荐与配置',
                items: [
                    { text: '多平台软件', link: '/efficiency/software/cross-platform' },
                    { text: 'Mac 平台', link: '/efficiency/software/mac' },
                    { text: 'Windows 平台', link: '/efficiency/software/windows' },
                    { text: '浏览器设置与扩展', link: '/efficiency/software/browser' },
                    { text: 'Visual Studio Code 配置', link: '/efficiency/software/vscode' },
                    { text: 'WebStorm 配置', link: '/efficiency/software/webstorm' }
                ]
            },
            { text: '在线工具', link: '/efficiency/online-tools' },
            { text: '书签脚本', link: '/efficiency/bookmark-scripts' }
        ],
        activeMatch: '^/efficiency'
    },
    {
        text: 'About',
        link: '/about'
    }
]
