<template>
  <div class="m-center">
    <div class="m-con">
      <div class="mt-8 pb-3 text-4xl" style="border-bottom: 1px solid var(--vp-c-divider);">RSS 订阅</div>
      <div class="cursor-default inline-block mt-3 px-2 py-1 max-w-200px" :class="{
        'bg-just-light/20': tag === state.currentName,
      }" :key="tag" @click="collectItemInfo(tag)" v-if="state.names" v-for="(tag, idx) in state.names">
        <span class="overflow-clip line-clamp-1">{{ tag }}</span>
      </div>
      <div class="pb-3 text-4xl" style="border-bottom: 1px solid var(--vp-c-divider);"></div>

      <div class="pt-5 text-lg" v-for="(items, year) in paginatedItemsByYear" :key="year">
        <header class="pb-2">
          <h1 class="text-2xl">{{ year }}</h1>
        </header>
        <div class="pl-2 md:pl-4 flex" v-for="item in items" :key="item.link">
          <div class="basis-1/6 text-hidden line-clamp-1" :aria-label="item.date">
            {{ dayjs(item.date).format("MM月DD日") }}
          </div>
          <div class="basis-4/6 text-hidden line-clamp-1">
            <a class="cursor-default hover:bg-just-light/20 hover:text-just-dark" :href="item.link" target="_self">
              {{ item.title }}
            </a>
          </div>
          <div class="basis-2/6 text-hidden line-clamp-1">
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="flex justify-center mt-4 mb-2">
        <div style="border: 1px dashed var(--vp-c-divider);">
          <button class="mx-1 px-2 py-1 border rounded hover:bg-gray-200" @click="changePage(state.currentPage - 1)"
            :disabled="state.currentPage === 1">
            上一页
          </button>
          <span class="mx-2" style="align-content: center;">第 {{ state.currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button class="mx-1 px-2 py-1 border rounded hover:bg-gray-200" @click="changePage(state.currentPage + 1)"
            :disabled="state.currentPage === totalPages">
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import dayjs from "dayjs"
import feeds from "../../../feeds-sub-data.json"

export interface FeedsItem {
  name: string  // 订阅名称
  title: string // 文章标题
  link: string  // 文章链接
  date: string  // 文章发表时间
}

onMounted(() => {
  initGroup();
  collectItemInfo();
});

const state = reactive({
  currentName: "",                                   // 当前选中的标签名称
  itemsGroup: {} as { [key: string]: FeedsItem[] },  // 按名称分组的项目
  names: [] as string[],                             // 所有的名称列表
  currItems: [] as FeedsItem[],                      // 当前显示的项目
  itemsByYear: {} as { [key: string]: FeedsItem[] }, // 按年份分组的项目
  years: [] as string[],                             // 年份列表
  currentPage: 1,                                    // 当前页码
  pageSize: 18                                       // 每页显示的项目数
});

// 初始化项目分组
function initGroup() {
  feeds.forEach((v) => {
    state.itemsGroup[v.name] = v.items; // 将项目按名称分组
    state.names.push(v.name);           // 保存名称列表
  });
}

// 收集项目信息并按选择进行过滤和排序
function collectItemInfo(name?: string) {
  if (!name || name === state.currentName) {
    state.currItems = feeds.flatMap((v) => {
      return v.items;
    });
    state.currentName = ""; // 如果未选择或选择相同标签，显示所有项目
  } else {
    state.currentName = name; // 设置当前选中标签
    state.currItems = state.itemsGroup[name]; // 获取对应标签的项目
  }

  // 按时间排序项目
  state.currItems.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

  if (state.currItems) {
    state.itemsByYear = {};                                       // 重置按年份分组的项目
    state.years = [];                                             // 重置年份列表
    state.currItems.forEach((v) => {
      const year = dayjs(v.date).format("YYYY");                  // 提取年份
      if (!state.years.includes(year)) state.years.push(year);    // 添加年份
      if (!state.itemsByYear[year]) state.itemsByYear[year] = []; // 初始化年份分组
      state.itemsByYear[year].push(v);                            // 添加项目到对应年份
    });
  }

  // state.years.sort((a, b) => parseInt(b) - parseInt(a)); // 倒序排序年份

  state.currentPage = 1; // 重置页码
}

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(state.currItems.length / state.pageSize);
});

// 获取当前页的项目并按年份分组
const paginatedItemsByYear = computed(() => {
  const startIndex = (state.currentPage - 1) * state.pageSize;
  let currentIndex = 0;
  let result: { [key: string]: FeedsItem[] } = {};
  let count = 0;

  // 分组但不排序
  for (const year of state.years) {
    if (!state.itemsByYear[year]) continue;

    const yearItems = state.itemsByYear[year];
    const yearItemCount = yearItems.length;

    // 如果当前年份的所有条目在当前页之前，跳过
    if (currentIndex + yearItemCount <= startIndex) {
      currentIndex += yearItemCount;
      continue;
    }

    // 找到当前年份中的开始位置
    const yearStartIndex = Math.max(startIndex - currentIndex, 0);
    // 计算当前页还能容纳的条目数
    const remainingItems = state.pageSize - count;

    // 确定当前年份中展示的结束位置
    const yearEndIndex = Math.min(yearStartIndex + remainingItems, yearItemCount);

    if (!result[year]) result[year] = [];

    result[year].push(...yearItems.slice(yearStartIndex, yearEndIndex));

    count += yearEndIndex - yearStartIndex;
    currentIndex += yearItemCount;

    // 如果已经填满当前页，退出循环
    if (count >= state.pageSize) break;
  }

  // 将年份靠近的放在最前面
  const sortedResult: { [key: string]: FeedsItem[] } = {};
  const sortKeys = Object.keys(result)
    .sort((a, b) => { return parseInt(b) - parseInt(a) })
    .forEach((key) => {
      sortedResult[key + '年'] = result[key];
    });
  return sortedResult;
});


// 改变当前页
function changePage(page: number) {
  if (page > 0 && page <= totalPages.value) {
    state.currentPage = page;
  }
}
</script>

<style scoped>
.m-center {
  @apply flex justify-center items-center
}

.m-con {
  @apply max-w-[90%] sm:w-[50%] lg:w-[70%]
}

.text-hidden {
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-inline-box;
}
</style>
