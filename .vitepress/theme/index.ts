// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import { useData, EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import comment from "./components/comment.vue"
import './styles/index.scss'

export default {
  extends: DefaultTheme,
  Layout: () => {
    const props: Record<string, any> = {}
    // 获取 frontmatter
    const { frontmatter } = useData()

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass
    }

    return h(DefaultTheme.Layout, props, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "doc-after": () => h(comment),
    })
  },
  // enhanceApp(ctx) {
  //     DefaultTheme.enhanceApp(ctx);

  //     ctx.app.component('ArticleMetadata', ArticleMetadata);
  // },

  enhanceApp({ app }) {
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
