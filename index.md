---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
layoutClass: 'm-home-layout'

hero:
  name: "YY's Blog"
  tagline: 积累如同滴水穿石，知识之泉汇聚成河
  image:
    src: /background.png
    alt: background
  actions:
    - theme: brand
      text: 进入博客
      link: /blog
    - theme: alt
      text: 进入仓库
      link: https://github.com/yqchilde/MyNewBlog

features:
  - icon: 📖
    title: 后端纪事
    details: 整理后端常用知识点<small>（面试八股文）</small><br />不妥之处，敬请雅正
    link: /review
    linkText: 前端常用知识
  - icon: 💡
    title: Workflow
    details: 在工作中学到的一切<small>（常用库/工具/奇淫技巧等）</small><br />配合 CV 大法来更好的摸鱼
    link: /workflow/style-guide
    linkText: 常用工具库
  - icon: 🧰
    title: 提效工具
    details: 工欲善其事，必先利其器<br />记录开发和日常使用中所用到的软件、插件、扩展等
    link: /efficiency/mac
    linkText: 提效工具
---

<ClientOnly><Heatmap /></ClientOnly>

<style>
.m-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}

.m-home-layout .details small {
  opacity: 0.8;
}

.m-home-layout .item:last-child .details {
  display: flex;
  justify-content: flex-end;
  align-items: end;
}
</style>
