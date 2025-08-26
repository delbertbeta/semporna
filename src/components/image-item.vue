<template>
  <div
    @click="handleItemClick"
    class="image-box fade-in"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :data-year="new Date(item.date).getFullYear()"
    :data-month="new Date(item.date).getMonth() + 1"
  >
    <img class="image" :src="matchImageUrl(item.poster, 'higher', '720p')" />
    <Transition>
      <image-item-hover-meta v-if="hover" :item="item" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ImageItemHoverMeta from './image-item-hover-meta.vue';
import { useAppStore } from '@/store';
import { AlbumMeta } from '@/typings';
import { matchImageUrl } from '@/utils';

const props = defineProps<{ item: AlbumMeta }>();

const store = useAppStore();
const { openAlbumModal } = store;

const hover = ref(false);

const handleMouseEnter = () => {
  hover.value = true;
};

const handleMouseLeave = () => {
  hover.value = false;
};

const handleItemClick = () => {
  openAlbumModal(props.item);
};
</script>

<style lang="less">
.image-box {
  cursor: pointer;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  padding: 20px 20px 56px 20px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 64px rgba(0, 0, 0, 0.06);
  background-color: rgba(241, 241, 241);
  transform: translateY(0);
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 6px 10px 64px rgba(0, 0, 0, 0.14);
    transform: translateY(-8px);
  }
}

.image {
  display: block;
  height: auto;
  width: 100%;
  max-height: 600px;
  object-fit: cover;
}
</style>
