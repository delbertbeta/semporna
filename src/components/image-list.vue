<template>
  <masonry-wall class="image-list-container" :items="images.concat(images).concat(images)" :column-width="300"
    :min-columns="1" :max-columns="5" :gap="32">
    <template #default="{ item, index }">
      <image-item :item="item" :key="index" />
    </template>
  </masonry-wall>
</template>

<script setup lang="ts">
import { images } from '../mockData/testData';
import ImageItem from './image-item.vue';
import { reactive } from "vue";

</script>

<style lang="less">
.image-list-container {
  box-sizing: border-box;
  margin: 80px 160px 80px 520px;
}
</style>
