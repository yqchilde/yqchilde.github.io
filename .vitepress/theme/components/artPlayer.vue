<template>
    <div class="artplayer-wrapper">
        <div ref="artRef" style="aspect-ratio: 16/9"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Artplayer from 'artplayer';

const props = defineProps({
    url: String,
});

const artRef = ref(null);

onMounted(() => {
    console.log('加载播放器');
    artRef.value = new Artplayer({
        url: props.url,
        container: artRef.value,
        autoSize: false,
        setting: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        hotkey: true,
        pip: true,
        mutex: true,
        fullscreen: true,
        fullscreenWeb: true,
        playsInline: true,
    });
});

onBeforeUnmount(() => {
    console.log('卸载播放器');
    artRef.value.destroy();
});
</script>

<style lang="scss" scoped>
.artplayer-wrapper {
    border-radius: 8px;
    background-color: #eff0f3;
    padding: 8px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}
</style>