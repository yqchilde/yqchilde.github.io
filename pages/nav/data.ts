import type { NavData } from '../../.vitepress/theme/types'

export const NAV_DATA: NavData[] = [
  {
    title: '常用工具',
    items: [
      {
        icon: 'https://tinypng.com/images/apple-touch-icon.png',
        title: 'TinyPNG',
        desc: '在线图片压缩工具',
        link: 'https://tinypng.com'
      },
      {
        icon: 'https://devtool.tech/logo.svg',
        title: '开发者武器库',
        desc: '开发者武器库，做开发者最专业最好用的专业工具箱',
        link: 'https://devtool.tech'
      },
      {
        icon: 'https://tool.lu/favicon.ico',
        title: '在线工具',
        desc: '开发人员的工具箱',
        link: 'https://tool.lu'
      },
      {
        icon: 'https://www.sojson.com/sojson/favicon16.png',
        title: 'SoJson在线解析',
        desc: 'JSON在线解析及格式化验证',
        link: 'https://www.sojson.com'
      }
    ]
  },
  {
    title: '开发参考',
    items: [
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="1em" width="1em"><path d="m21.66 10.44-.98 4.18c-.84 3.61-2.5 5.07-5.62 4.77-.5-.04-1.04-.13-1.62-.27l-1.68-.4c-4.17-.99-5.46-3.05-4.48-7.23l.98-4.19c.2-.85.44-1.59.74-2.2 1.17-2.42 3.16-3.07 6.5-2.28l1.67.39c4.19.98 5.47 3.05 4.49 7.23Z" fill="#c9d1d9"></path><path d="M15.06 19.39c-.62.42-1.4.77-2.35 1.08l-1.58.52c-3.97 1.28-6.06.21-7.35-3.76L2.5 13.28c-1.28-3.97-.22-6.07 3.75-7.35l1.58-.52c.41-.13.8-.24 1.17-.31-.3.61-.54 1.35-.74 2.2l-.98 4.19c-.98 4.18.31 6.24 4.48 7.23l1.68.4c.58.14 1.12.23 1.62.27Zm2.43-8.88c-.06 0-.12-.01-.19-.02l-4.85-1.23a.75.75 0 0 1 .37-1.45l4.85 1.23a.748.748 0 0 1-.18 1.47Z" fill="#228e6c"></path><path d="M14.56 13.89c-.06 0-.12-.01-.19-.02l-2.91-.74a.75.75 0 0 1 .37-1.45l2.91.74c.4.1.64.51.54.91-.08.34-.38.56-.72.56Z" fill="#228e6c"></path></svg>'
        },
        title: 'Quick Reference',
        desc: '为开发人员分享快速参考备忘清单【速查表】',
        link: 'https://wangchujiang.com/reference',
        badge: '开源'
      },
      {
        icon: 'https://gorse.io/logo.png',
        title: 'Gorse',
        desc: '一个使用Go语言开发的开源推荐系统',
        link: 'https://gorse.io/zh',
        badge: '开源'
      },
      {
        icon: './favicon.ico',
        title: 'AST Explorer',
        desc: '一个使用Go语言开发的开源推荐系统',
        link: 'https://astexplorer.net',
        badge: '开源'
      },
    ]
  },
  {
    title: '推荐博客',
    items: [
      {
        icon: 'https://avatars.githubusercontent.com/u/9117028?v=4',
        title: 'Kaito\'s Blog',
        desc: '一位资深后端，涉及领域有 Redis、中间件、异地多活、K8s、云原生',
        link: 'http://kaito-kidd.com',
        badge: 'kaito'
      }
    ]
  },
  {
    title: 'GG棒',
    items: [
      {
        title: 'UnitedShop',
        desc: '可以看看老外在卖啥',
        link: 'https://unitedshop.su/usercp/auth/login',
        badge: 'Mark'
      },
      {
        title: 'Eneba',
        desc: '免登录买大饼礼品卡',
        link: 'https://www.eneba.com/vendor/azteco',
        badge: 'Mark'
      },
      {
        title: 'TGWiki',
        desc: '有Tg使用的问题或许可以在这里找到方案',
        link: 'https://tgnav.github.io/tgwiki',
        badge: 'Mark'
      },
    ]
  }
]
