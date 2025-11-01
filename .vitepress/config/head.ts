import type { HeadConfig } from 'vitepress'

const isDevelopment = process.env.NODE_ENV === 'development'

export const head: HeadConfig[] = [
  ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
  ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
  ['meta', { name: 'msapplication-TileImage', content: '/favicon.ico' }],
  ['meta', { name: 'baidu-site-verification', content: 'codeva-a9OBeZwEU6' }],
  ['link', { rel: 'apple-touch-icon', href: '/favicon.ico' }],
  ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#3eaf7c' }],
  ...(isDevelopment ? [] : [['script', { src: 'https://hm.baidu.com/hm.js?28d2c15f874fe87dc4038ad4d40b8a29' }]] as HeadConfig[]),
  ...(isDevelopment ? [] : [['script', { src: 'https://www.googletagmanager.com/gtag/js?id=G-H11BRGSRLP' }]] as HeadConfig[]),
]
