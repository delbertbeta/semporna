<template>
  <masonry-wall
    class="image-list-container"
    :items="albums"
    :column-width="isMobile ? 160 : 300"
    :min-columns="1"
    :max-columns="isMobile ? 2 : 5"
    :gap="isMobile ? 4 : 32"
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
import { useScrollOffset } from '@/composables/useScrollOffset';

const store = useAlbumStore();
const { albums } = storeToRefs(store);
const { isMobile } = useScrollOffset();
</script>

<style lang="less">
.image-list-container {
  box-sizing: border-box;
  margin: 80px 160px 80px 520px;

  @media (max-width: 768px) {
    margin: 0;
    padding: 6px;
  }
}
</style>
