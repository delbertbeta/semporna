<template>
  <initial-loading-overlay :loading="store.initializing" />
  <router-view />
</template>

<script setup lang="ts">
import InitialLoadingOverlay from './components/initial-loading-overlay.vue';
import { useAlbumStore } from './store/album';

const store = useAlbumStore();
const { initAlbums } = store;

void initAlbums();
</script>

<style lang="less">
@import './assets/less/common.less';
</style>
