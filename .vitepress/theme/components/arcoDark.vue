<template></template>
<script setup lang="ts">
import { useData } from "vitepress";
import { watch } from "vue";

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

</script>