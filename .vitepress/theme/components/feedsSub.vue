<template>
  <div class="m-center">
    <div class="m-con">
      <div>
        <div class='cursor-default inline-block px-2 py-1 max-w-200px' :class="{
          'bg-just-light/20 text-just-dark': tag === state.currentName,
        }" :key="tag" @click="collectItemInfo(tag)" v-if="state.names" v-for="(tag, idx) in state.names">
          <span class="overflow-clip line-clamp-1">{{ tag }}</span>
        </div>
      </div>

      <div class="pt-5 text-lg" v-for="year in state.years">
        <header class="pb-2">
          <h1 class="text-2xl">{{ year }}年</h1>
        </header>
        <div class="pl-2 md:pl-4 flex" v-for="item in state.itemsByYear[year]">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
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

  if (state.currItems) {
    state.itemsByYear = {};
    state.years = [];
    state.currItems.forEach((v) => {
      const year = dayjs(v.time).format("YYYY");
      state.years.find((v) => v === year) || state.years.push(year);
      if (!state.itemsByYear[year]) {
        state.itemsByYear[year] = [];
      }
      state.itemsByYear[year].push(v);
    });
  }
  if (state.itemsByYear) {
    Object.keys(state.itemsByYear).forEach((v) => {
      state.itemsByYear[v].sort((a, b) => {
        return dayjs(b.time).valueOf() - dayjs(a.time).valueOf();
      });
    });
  }

  if (state.years) {
    state.years.sort((a, b) => {
      return parseInt(b) - parseInt(a);
    });
  }
}
</script>

<style scoped></style>