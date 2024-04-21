---
description: 导航
layoutClass: m-nav-layout
outline: [2, 3, 4]
showArticleMetadata: false
editLink: false
---

<script setup>
import { NAV_DATA } from './data'
</script>
<style src="./style.scss"></style>

# 后端导航

::: info
* 未完待续...
:::

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>