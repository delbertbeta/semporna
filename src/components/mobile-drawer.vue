<!-- src/components/mobile-drawer.vue -->
<template>
  <teleport to="body">
    <!-- 遮罩 -->
    <transition name="mask-fade">
      <div
        v-if="isOpen"
        class="drawer-mask"
        @click="handleClose"
      />
    </transition>
    <!-- 抽屉面板 -->
    <transition name="drawer-slide">
      <div
        v-if="isOpen"
        ref="drawerRef"
        class="drawer-panel"
        :class="{ 'no-blur': isAnyModalOpen }"
      >
        <sidebar-content />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwipe } from '@vueuse/core';
import { useAppStore } from '@/store';
import SidebarContent from './sidebar-content.vue';

const store = useAppStore();
const { mobileDrawerOpen, isAnyModalOpen } = storeToRefs(store);
const { closeMobileDrawer } = store;

const drawerRef = ref<HTMLElement | null>(null);
const isOpen = mobileDrawerOpen;

const handleClose = () => {
  closeMobileDrawer();
};

// 向左滑动关闭抽屉（距离 > 40px 才触发，避免纵向滚动误触）
const { lengthX, direction: swipeDirection } = useSwipe(drawerRef, {
  threshold: 10,
  onSwipeEnd() {
    if (
      swipeDirection.value === 'left' &&
      Math.abs(lengthX.value) > 40
    ) {
      closeMobileDrawer();
    }
  },
});
</script>

<style lang="less" scoped>
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  z-index: 200;
}

.drawer-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(80vw, 300px);
  z-index: 201;
  padding: 42px 32px;
  box-sizing: border-box;
  background: linear-gradient(90deg, #edecea 0%, rgba(237, 236, 234, 0.95) 100%);
  backdrop-filter: blur(32px);
  transition: backdrop-filter 0.3s ease;

  &.no-blur {
    backdrop-filter: none;
  }
}

.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: opacity 0.3s ease;
}
.mask-fade-enter-from,
.mask-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
}
</style>
