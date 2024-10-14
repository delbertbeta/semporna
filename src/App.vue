<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAlbumStore } from './store/album';
const store = useAlbumStore();
const { initAlbums } = store;

void initAlbums();
</script>

<style lang="less">
@import './assets/less/common.less';
</style>
