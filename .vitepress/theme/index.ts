// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import './style.css'
import ArticleMetadata from './components/ArticleMetadata.vue'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  // enhanceApp(ctx) {
  //     DefaultTheme.enhanceApp(ctx);

  //     ctx.app.component('ArticleMetadata', ArticleMetadata);
  // },

  enhanceApp({app}) {
    app.component('ArticleMetadata', ArticleMetadata);
},

  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
  // enhanceApp({ app, router, siteData }) {
  //   // ...
  // }
} satisfies Theme
