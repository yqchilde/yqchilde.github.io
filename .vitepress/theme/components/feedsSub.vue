<template>
  <div class="m-center">
    <div class="m-con">
      <div>
        <div
          class="cursor-default inline-block px-2 py-1 max-w-200px"
          :class="{
            'bg-just-light/20 text-just-dark': tag === state.currentName,
          }"
          :key="tag"
          @click="collectItemInfo(tag)"
          v-if="state.names"
          v-for="(tag, idx) in state.names"
        >
          <span class="overflow-clip line-clamp-1">{{ tag }}</span>
        </div>
      </div>

      <div class="pt-5 text-lg" v-for="(items, year) in paginatedItemsByYear" :key="year">
        <header class="pb-2">
          <h1 class="text-2xl">{{ year }}年</h1>
        </header>
        <div class="pl-2 md:pl-4 flex" v-for="item in items" :key="item.url">
          <div class="basis-1/6 text-hidden line-clamp-1" :aria-label="item.time">
            {{ formatDate(item.time) }}
          </div>
          <div class="basis-4/6 text-hidden line-clamp-1">
            <a class="cursor-default hover:bg-just-light/20 hover:text-just-dark" :href="item.url" target="_self">
              {{ item.title }}
            </a>
          </div>
          <div class="basis-2/6 text-hidden line-clamp-1">
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="flex justify-center mt-4">
        <button
          class="mx-1 px-2 py-1 border rounded hover:bg-gray-200"
          @click="changePage(state.currentPage - 1)"
          :disabled="state.currentPage === 1"
        >
          上一页
        </button>
        <span class="mx-2">第 {{ state.currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button
          class="mx-1 px-2 py-1 border rounded hover:bg-gray-200"
          @click="changePage(state.currentPage + 1)"
          :disabled="state.currentPage === totalPages"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import dayjs from "dayjs";
import links from "../../../links.json";

export interface FeedsItem {
  name: string
  title: string
  time: string
  url: string
}

onMounted(() => {
  initGroup();
  collectItemInfo();
});

const state = reactive({
  currentName: "",
  itemsGroup: {} as { [key: string]: FeedsItem[] },
  names: [] as string[],
  currItems: [] as FeedsItem[],
  itemsByYear: {} as { [key: string]: FeedsItem[] },
  years: [] as string[],
  currentPage: 1,
  pageSize: 20
});

const formatDate = (date: string) => {
  return dayjs(date).format("M月D日");
};

function initGroup() {
  links.items.forEach((v) => {
    state.itemsGroup[v.name] = v.info;
    state.names.push(v.name);
  });
}

function collectItemInfo(name?: string) {
  if (!name || name === state.currentName) {
    state.currItems = links.items.flatMap((v) => {
      return v.info;
    });
    state.currentName = "";
  } else {
    state.currentName = name;
    state.currItems = state.itemsGroup[name];
  }

  // 根据时间对 currItems 进行排序
  state.currItems.sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf());

  if (state.currItems) {
    state.itemsByYear = {};
    state.years = [];
    state.currItems.forEach((v) => {
      const year = dayjs(v.time).format("YYYY");
      if (!state.years.includes(year)) state.years.push(year);
      if (!state.itemsByYear[year]) state.itemsByYear[year] = [];
      state.itemsByYear[year].push(v);
    });
  }

  state.years.sort((a, b) => parseInt(b) - parseInt(a));

  // 重置页码
  state.currentPage = 1;
}

const totalPages = computed(() => {
  return Math.ceil(state.currItems.length / state.pageSize);
});

const paginatedItemsByYear = computed(() => {
  const startIndex = (state.currentPage - 1) * state.pageSize;
  let currentIndex = 0;
  let result: { [key: string]: FeedsItem[] } = {};
  let count = 0;

  // 按年份降序排序
  const sortedYears = state.years.slice().sort((a, b) => parseInt(b) - parseInt(a));

  for (const year of sortedYears) {
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

  return result;
});

function changePage(page: number) {
  if (page > 0 && page <= totalPages.value) {
    state.currentPage = page;
  }
}
</script>

<style scoped></style>
