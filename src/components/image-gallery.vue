<template>
  <div class="scroll-wrapper" @scroll="handleScroll">
    <full-screen-banner />
    <image-list />
  </div>
</template>

<script lang="ts" setup>
import ImageList from './image-list.vue';
import FullScreenBanner from './full-screen-banner.vue';
import { useAlbumStore } from '@/store/album';
import { throttle } from 'lodash-es';

const store = useAlbumStore();

const handleScroll = throttle(() => {
  const scrollWrapper = document.querySelector('.scroll-wrapper');
  if (!scrollWrapper) return;

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

    if (rect.top > 120) {
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
</style>
