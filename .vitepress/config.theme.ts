import type { DefaultTheme } from 'vitepress';

export const themeConfig: DefaultTheme.Config = {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
        label: "页面导航",
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
        provider: 'local'
    },
    nav: [
        { text: '首页', link: '/' },
        {
            text: "后端",
            items: [
                { text: "Golang", link: "/posts/backend/golang/" },
                { text: "PHP", link: "/posts/backend/php/" }
            ]
        },
        {
            text: "前端",
            items: [
                { text: "UniAPP", link: "/posts/frontend/uniapp/" }
            ]
        },
        {
            text: "奇技淫巧",
            items: [
                { text: "开发篇", link: "/posts/tips/develop/" },
                { text: "工具篇", link: "/posts/tips/tools/" },
                { text: "语言篇", link: "/posts/tips/langs/" },
                { text: "软路由篇", link: "/posts/tips/router/" },
                { text: "自动化篇", link: "/posts/tips/automation/" },
            ]
        },
        { text: '示例', link: '/markdown-examples' },
        {
            text: '网站相关',
            items: [
                { text: '关于博主', link: '/website/about' }
            ]
        }
    ],
    sidebar: {
        '/posts/backend/': [
            {
                text: 'Golang篇',
                link: '/posts/backend/golang/',
                collapsed: false,
                items: [
                    { text: 'Golang编译应用通过Github Release实现检测覆盖更新', link: '/posts/backend/golang-makefile-and-additional' },
                    { text: 'Golang的Data Race问题', link: '/posts/backend/golang-race' },
                    { text: 'Golang的Request.Body复用', link: '/posts/backend/golang-request-body-reuse' },
                    { text: 'Golang的json序列化详解', link: '/posts/backend/golang-json-serialization' },
                    { text: 'Golang的Context学习', link: '/posts/backend/golang-learning-context' },
                    { text: 'Golang的Slice扩容机制', link: '/posts/backend/golang-slice-expand-capacity' },
                    { text: 'Golang实现进制计算两种方法', link: '/posts/backend/golang-binary-calculation' },
                    { text: 'Golang实现几种基本数据结构', link: '/posts/backend/golang-implements-base-data-structures' },
                    { text: 'Golang实现简单Trie树', link: '/posts/backend/golang-trie' },
                    { text: 'Golang验证码–base64Captcha库1.3.0版本构建实例', link: '/posts/backend/golang-base64captcha' },
                    { text: '在算能盒子 (BMNN) 上使用gocv', link: '/posts/backend/sophon-linaro-opencv-gocv' },
                    { text: 'golang写的web程序如何简单的部署到宝塔面板中', link: '/posts/backend/golang-web-baota' },
                ]
            },
            {
                text: 'PHP篇',
                link: '/posts/backend/php/',
                collapsed: false,
                items: [
                    { text: 'PHPMailer6.0.7如何在类中被调用', link: '/posts/backend/php-phpmailer' },
                    { text: 'php多维数组降维记载', link: '/posts/backend/php-array' },
                    { text: 'php在foreach里面合并数组', link: '/posts/backend/php-foreach-merge' }
                ]
            },
        ],
        '/posts/frontend/': [
            {
                text: 'UniAPP篇',
                link: '/posts/frontend/uniapp/',
                collapsed: false,
                items: [
                    { text: 'uniapp的Form提交之蛋疼的picker', link: '/posts/frontend/uniapp-form-picker' },
                    { text: 'Uni-App生成邀请二维码', link: '/posts/frontend/uniapp-generate-invitation-qrcode' },
                    { text: 'uniapp生成随机验证码&php合成验证码图片', link: '/posts/frontend/uniapp-generate-random-verification-code' },
                    { text: '记载一下uniapp携带session的请求', link: '/posts/frontend/uniapp-with-session' },
                    { text: 'Uni-App的手势监听滑动', link: '/posts/frontend/uniapp-shoushi-huadong' }
                ]
            },
        ],
        '/posts/tips/': [
            {
                text: '开发篇',
                link: '/posts/tips/develop/',
                collapsed: false,
                items: [
                    { text: 'GoModule添加gitlab私有仓库', link: '/posts/tips/go-mod-private-repo' },
                    { text: 'Golang实现判断一个点是否在多边形中', link: '/posts/tips/point-in-polygon-for-golang' },
                    { text: 'Go的template模板关于range换行和crontab的简单正则表达式', link: '/posts/tips/template-range-crontab-regex' },
                    { text: 'Golang实现一个简单的密码强度验证', link: '/posts/tips/regex-lookground-verify-passowrd' },
                    { text: 'MySQL的优化笔记', link: '/posts/tips/mysql-optimization-notes' },
                    { text: 'MySQL中insert数据时怎么用where条件', link: '/posts/tips/mysql-insert-how-where' },
                    { text: 'MySQL5.7修改root密码', link: '/posts/tips/mysql5.7-update-password' },
                    { text: 'docker-compose使用env处理环境变量妙用', link: '/posts/tips/docker-compose-env-file' },
                    { text: 'Docker Compose简单配置Mysql Nginx挂载持久化', link: '/posts/tips/docker-compose-mysql-nginx' },
                    { text: 'Docker安装MySQL后无法登录', link: '/posts/tips/docker-mysql-login-failed' },
                    { text: 'Ubuntu 下关于 Netplan 的一次报错', link: '/posts/tips/ubuntu-netplan' },
                    { text: '在Ubuntu上安装指定版本的Go语言', link: '/posts/tips/ubuntu-install-golang' },
                    { text: 'Ubuntu启动Docker报没有权限', link: '/posts/tips/ubuntu-docker-permission-denied' },
                    { text: 'Nginx常用配置', link: '/posts/tips/nginx-configuration' },
                ]
            },
            {
                text: '工具篇',
                link: '/posts/tips/tools/',
                collapsed: false,
                items: [
                    { text: '在Mac上彻底卸载Docker', link: '/posts/tips/uninstall-docker-on-macos' },
                    { text: 'win10企业版缺失Microsoft Store及一键切换版本', link: '/posts/tips/win10-missing-microsoftstore' },
                    { text: 'MacOS-如何删除Free Space，使得APFS容器将Free Space占用', link: '/posts/tips/macos-remove-freespace' },
                    { text: '解决在 Apple M1 上使用 Parallels 安装 Windows 后无法使用 OpenVPN 的问题', link: '/posts/tips/macos-parallels-miss-tap-windows' },
                    { text: '使用GitHub Actions部署Hugo到阿里云', link: '/posts/tips/hugo-github-actions-aliyun' },
                    { text: 'Git常用命令速查表', link: '/posts/tips/git-command-quick-check' },
                    { text: '正确配置rocket-nginx，加速你的wordpress', link: '/posts/tips/wordpress-rocket' },
                    { text: 'Git设置代理解决git clone太慢的问题', link: '/posts/tips/git-clone-slow' },
                    { text: '油猴脚本 + Aria RPC + Motrix批量下载哔哩哔哩视频', link: '/posts/tips/aria-rpc-motrix-bilibili' },
                    { text: '解决win10的cmd命令行不转义ANSI序列（让cmd输出彩色字体）', link: '/posts/tips/windows-cmd-ansi' },
                    { text: '如何使用 Karabiner 来代替 Capslox 的体验', link: '/posts/tips/capslox-karabiner' }
                ]
            },
            {
                text: '语言篇',
                link: '/posts/tips/langs/',
                collapsed: false,
                items: [
                    { text: 'get-test', link: '/posts/tips/get-test' }
                ]
            },
            {
                text: '软路由篇',
                link: '/posts/tips/router/',
                collapsed: false,
                items: [
                    { text: 'Pve上使用Shell脚本保活虚拟机', link: '/posts/tips/soft-route-keepalive' },
                    { text: '玩软路由的一些笔记', link: '/posts/tips/soft-route-notes' }
                ]
            },
            {
                text: '自动化篇',
                link: '/posts/tips/automation/',
                collapsed: false,
                items: [
                    { text: '利用脚本软件“一触即发”写一个自动收取，偷取支付宝能量脚本', link: '/posts/tips/mayisenlin-script' }
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