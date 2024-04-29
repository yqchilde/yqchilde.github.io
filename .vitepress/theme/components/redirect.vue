<template>

</template>

<script setup lang="ts">

const props = defineProps({
    route: String,
});

window.location.href = window.location.href + props.route;
</script>

<style scoped></style>