<template>
  <div class="about-block" :class="{ 'no-blur': isAnyModalOpen }">
    <sidebar-content />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';
import SidebarContent from './sidebar-content.vue';

const store = useAppStore();
const { isAnyModalOpen } = storeToRefs(store);
</script>

<style lang="less" scoped>
.about-block {
  position: absolute;
  box-sizing: border-box;
  width: 360px;
  height: 100%;
  padding: 42px;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg, #edecea 0%, rgba(237, 236, 234, 0.6) 100%);
  backdrop-filter: blur(32px);
  transition: backdrop-filter 0.3s ease;
  z-index: 1;

  &.no-blur {
    backdrop-filter: none;
  }
}

@media (max-width: 768px) {
  .about-block {
    display: none;
  }
}
</style>
