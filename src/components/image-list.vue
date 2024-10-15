<template>
  <masonry-wall
    class="image-list-container"
    :items="albums"
    :column-width="300"
    :min-columns="1"
    :max-columns="5"
    :gap="32"
  >
    <template #default="{ item, index }">
      <image-item :item="item" :key="index" />
    </template>
  </masonry-wall>
</template>

<script setup lang="ts">
import ImageItem from './image-item.vue';

import { useAlbumStore } from '@/store/album';
import { storeToRefs } from 'pinia';

const store = useAlbumStore();
const { albums } = storeToRefs(store);
</script>

<style lang="less">
.image-list-container {
  box-sizing: border-box;
  margin: 80px 160px 80px 520px;
}
</style>
