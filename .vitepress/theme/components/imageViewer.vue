<template>
    <div class="image-viewer">
        <a-image-preview-group v-model:visible="show" infinite :srcList="previewImageInfo.list"
            :default-current="previewImageInfo.idx" :defaultScale="0.65" :key="previewImageInfo.idx"
            @close="show = false" />
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useData } from "vitepress";
import { watch } from "vue";

const show = ref(false)
const previewImageInfo = reactive<{ url: string; list: string[]; idx: number }>(
    {
        url: '',
        list: [],
        idx: 0
    }
)

const { isDark } = useData();
watch(
    isDark,
    () => {
        if (isDark.value) {
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            document.body.removeAttribute('arco-theme');
        }
    },
    {
        immediate: true,
    }
);

function previewImage(e: Event) {
    const target = e.target as HTMLElement
    const currentTarget = e.currentTarget as HTMLElement
    if (target.tagName.toLowerCase() === 'img') {
        const imgs = currentTarget.querySelectorAll<HTMLImageElement>(
            '.content-container .main img'
        )
        const idx = Array.from(imgs).findIndex(el => el === target)
        const urls = Array.from(imgs).map(el => el.src)

        const url = target.getAttribute('src')
        previewImageInfo.url = url!
        previewImageInfo.list = urls
        previewImageInfo.idx = idx

        console.log(previewImageInfo);


        // 兼容点击main之外的图片
        if (idx === -1 && url) {
            previewImageInfo.list.push(url)
            previewImageInfo.idx = previewImageInfo.list.length - 1
        }
        show.value = true
    }
}
onMounted(() => {
    const docDomContainer = document.querySelector('#VPContent')
    docDomContainer?.addEventListener('click', previewImage)
})

onUnmounted(() => {
    const docDomContainer = document.querySelector('#VPContent')
    docDomContainer?.removeEventListener('click', previewImage)
})
</script>
<style></style>