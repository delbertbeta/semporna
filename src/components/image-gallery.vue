<template>
  <div class="scroll-wrapper" @scroll="handleScroll">
    <mobile-banner-brand v-if="isMobile" />
    <full-screen-banner />
    <mobile-month-tabs v-if="isMobile" />
    <image-list />
  </div>
</template>

<script lang="ts" setup>
import { watch, onUnmounted } from 'vue';
import ImageList from './image-list.vue';
import FullScreenBanner from './full-screen-banner.vue';
import MobileBannerBrand from './mobile-banner-brand.vue';
import { useAlbumStore } from '@/store/album';
import { throttle } from 'lodash-es';
import { useScrollOffset } from '@/composables/useScrollOffset';
import MobileMonthTabs from './mobile-month-tabs.vue';

const store = useAlbumStore();
const { isMobile, scrollOffset } = useScrollOffset();

const handleScroll = throttle(() => {
  const imageItems = document.querySelectorAll(
    '.masonry-column:first-of-type .image-box'
  );
  let activeImage: Element | null = null;

  let low = 0;
  let high = imageItems.length - 1;
  let candidateIndex = -1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const rect = imageItems[mid].getBoundingClientRect();

    if (rect.top > scrollOffset.value) {
      high = mid - 1;
    } else if (rect.top < 0) {
      low = mid + 1;
    } else {
      candidateIndex = mid;
      high = mid - 1;
    }
  }

  if (candidateIndex !== -1) {
    activeImage = imageItems[candidateIndex];
  }

  if (activeImage) {
    const year = activeImage.getAttribute('data-year');
    const month = activeImage.getAttribute('data-month');
    if (year && month) {
      store.setActiveDate(parseInt(year), parseInt(month));
    }
  }
}, 200);

// 响应式管理 window scroll 监听（支持窗口 resize 切换断点）
watch(
  isMobile,
  (mobile) => {
    if (mobile) {
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="less">
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.fade-in {
  animation: fade-in 1s ease-in 0s backwards;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    visibility: hidden;
  }

  100% {
    opacity: 1;
    visibility: visible;
  }
}

@media (max-width: 768px) {
  .scroll-wrapper {
    height: auto;
    overflow-y: unset;
  }
}
</style>
