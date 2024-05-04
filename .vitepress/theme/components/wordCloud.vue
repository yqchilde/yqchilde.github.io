<template>
  <div id="wordcloud-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { WordCloud } from '@antv/g2plot'

// 定义属性
const props = defineProps({
  dataList: {
    type: Array as () => Array<Record<string, any>>,
    default: () => [] as Array<Record<string, any>>,
  },
})

// 渲染 WordCloud
let wordCloud: WordCloud;
onMounted(() => {
  wordCloud = new WordCloud("wordcloud-container", {
    data: props.dataList,
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [12, 50],
      rotation: 0,
    },
    random: () => 0.5,
  });
  wordCloud.render();
  // 实现点击事件
  // wordCloud.on('plot:click', (e) => {
  //   console.log(e.data.data.text);
  // });
});

onBeforeUnmount(() => {
  wordCloud.destroy();
});
</script>