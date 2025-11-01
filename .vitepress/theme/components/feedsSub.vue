<template>
  <div class="feeds-sub-container">
    <div class="feeds-sub-content">
      <div class="feeds-sub-header">
        <h1 class="feeds-sub-title">RSS 订阅</h1>
      </div>
      
      <!-- 标签过滤器 -->
      <div class="feeds-sub-tags">
        <span 
          class="feeds-sub-tag" 
          :class="{ 'active': tag === state.currentName }"
          v-for="tag in state.names" 
          :key="tag"
          @click="collectItemInfo(tag)"
        >
          {{ tag }}
        </span>
      </div>

      <!-- RSS 订阅列表 -->
      <div class="feeds-sub-list">
        <div class="feeds-sub-year-section" v-for="(items, year) in paginatedItemsByYear" :key="year">
          <h2 class="feeds-sub-year">{{ year }}</h2>
          <div class="feeds-sub-items">
            <div class="feeds-sub-item" v-for="item in items" :key="item.link">
              <div class="feeds-sub-date">
                {{ dayjs(item.date).format("MM月DD日") }}
              </div>
              <div class="feeds-sub-title-cell">
                <a :href="item.link" target="_blank" class="feeds-sub-link">
                  {{ item.title }}
                </a>
              </div>
              <div class="feeds-sub-source">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="feeds-sub-pagination">
        <div class="pagination-controls">
          <button 
            class="pagination-btn" 
            @click="changePage(state.currentPage - 1)"
            :disabled="state.currentPage === 1"
          >
            上一页
          </button>
          <span class="pagination-info">
            第 {{ state.currentPage }} 页 / 共 {{ totalPages }} 页
          </span>
          <button 
            class="pagination-btn" 
            @click="changePage(state.currentPage + 1)"
            :disabled="state.currentPage === totalPages"
          >
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
.feeds-sub-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
}

.feeds-sub-content {
  width: 100%;
  max-width: 1200px;
}

.feeds-sub-header {
  margin-bottom: 30px;
}

.feeds-sub-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.feeds-sub-tags {
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feeds-sub-tag {
  display: inline-block;
  padding: 6px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.feeds-sub-tag:hover {
  background: var(--vp-c-brand-light);
  color: var(--vp-c-brand-dark);
}

.feeds-sub-tag.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.feeds-sub-list {
  margin-top: 30px;
}

.feeds-sub-year-section {
  margin-bottom: 40px;
}

.feeds-sub-year {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: var(--vp-c-text-1);
}

.feeds-sub-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feeds-sub-item {
  display: grid;
  grid-template-columns: 80px 1fr 150px;
  gap: 20px;
  padding: 6px 0;
  border-bottom: 1px solid var(--vp-c-divider-light);
  align-items: center;
}

.feeds-sub-item:last-child {
  border-bottom: none;
}

.feeds-sub-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.feeds-sub-title-cell {
  overflow: hidden;
}

.feeds-sub-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.feeds-sub-link:hover {
  color: var(--vp-c-brand);
  text-decoration: underline;
}

.feeds-sub-source {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feeds-sub-pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed var(--vp-c-divider);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feeds-sub-item {
    grid-template-columns: 60px 1fr 100px;
    gap: 10px;
    font-size: 0.9rem;
  }
  
  .feeds-sub-title {
    font-size: 2rem;
  }
  
  .feeds-sub-year {
    font-size: 1.5rem;
  }
  
  .feeds-sub-tags {
    gap: 8px;
  }
  
  .feeds-sub-tag {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .feeds-sub-container {
    padding: 10px;
  }
  
  .feeds-sub-item {
    grid-template-columns: 1fr;
    gap: 5px;
    text-align: left;
  }
  
  .feeds-sub-source {
    text-align: left;
  }
  
  .pagination-controls {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
