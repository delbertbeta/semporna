<template>
  <div class="album-modal-slider-container absolute w-full h-full">
    <swiper
      class="album-modal-slider w-full h-full"
      :modules="modules"
      :zoom="zoomOptions"
      :space-between="0"
      @swiper="handleSwiper"
      @zoomChange="handleZoomChange"
      :speed="720"
      :simulate-touch="isMobile"
      loop
    >
      <swiper-slide v-for="photo in album?.photos || []" :key="photo.id">
        <div
          class="album-modal-slider-item flex items-center justify-center w-full h-full"
        >
          <loading-placeholder
            :loading="!imageLoadedState[photo.id!]"
            theme="black"
          />
          <div class="swiper-zoom-container">
            <img
              v-show="imageLoadedState[photo.id!]"
              @load="imageLoadedState[photo.id!] = true"
              :id="`image-id-${photo.id}`"
              class="album-modal-img max-h-full max-w-full h-full w-full"
              :class="props.cover ? 'object-cover' : 'object-contain'"
              :src="matchImageUrl(photo.image, 'higher', '1080p')"
            />
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div
      v-if="(album?.photos?.length || 0) > 1"
      class="left-arrow"
      @click="slidePrev"
    >
      <svg-icon name="left" :width="16" :height="16" class="arrow-icon" />
    </div>
    <div
      v-if="(album?.photos?.length || 0) > 1"
      class="right-arrow"
      @click="slideNext"
    >
      <svg-icon name="right" :width="16" :height="16" class="arrow-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperInner } from 'swiper';
import { Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/zoom';
import LoadingPlaceholder from './loading-placeholder.vue';

import { ref, watchEffect, computed, watch } from 'vue';
import { AlbumRes } from '@/typings';
import { matchImageUrl } from '@/utils';
import { useScrollOffset } from '@/composables/useScrollOffset';

const { isMobile } = useScrollOffset();

const emit = defineEmits<{
  (e: 'slideChange', photo: AlbumRes['photos'][0]): void;
  (e: 'image-loading-state', loading: boolean): void;
}>();

const props = defineProps<{
  album: AlbumRes | null;
  cover?: boolean;
}>();

const modules = [Zoom];
const swiperRef = ref<SwiperInner>();
const currentSlideIndex = ref(0);
const currentZoomScale = ref(1);

const imageLoadedState = ref<Record<number, boolean>>({});

const zoomOptions = computed(() => (
  isMobile.value
    ? {
      maxRatio: 4,
      minRatio: 1,
      toggle: true,
    }
    : false
));

const canResetZoom = (swiper: SwiperInner) => {
  const activeSlide = swiper.slides?.[swiper.activeIndex] as HTMLElement | undefined;
  if (!activeSlide) {
    return false;
  }

  const zoomContainerClass = swiper.params.zoom?.containerClass || 'swiper-zoom-container';
  return Boolean(activeSlide.querySelector(`.${zoomContainerClass}`));
};

const resetZoomState = (swiper: SwiperInner) => {
  swiper.allowTouchMove = true;
  currentZoomScale.value = 1;

  if (!isMobile.value || swiper.zoom.scale <= 1.01) {
    return;
  }

  if (canResetZoom(swiper)) {
    swiper.zoom.out();
  }
};

const isCurrentImageLoading = computed(() => {
  const photos = props.album?.photos || [];
  const currentPhoto = photos[currentSlideIndex.value];
  const loadedState = imageLoadedState.value[currentPhoto?.id || ''];

  if (!currentPhoto) {
    return false;
  }
  return !loadedState;
});

watch(
  isCurrentImageLoading,
  (loading) => {
    emit('image-loading-state', loading);
  },
  {
    immediate: true,
  }
);

watchEffect(() => {
  if (!props.album?.photos) return;
  for (const photo of props.album.photos) {
    if (imageLoadedState.value[photo.id!] === undefined) {
      imageLoadedState.value[photo.id!] = false;
    }
  }
});

const handleSwiper = (swiper: SwiperInner) => {
  swiperRef.value = swiper;
  swiper.on('slideChange', () => {
    resetZoomState(swiper);
    const currentIndex = swiper.realIndex;
    currentSlideIndex.value = Number.isNaN(currentIndex) ? 0 : currentIndex;
    const photos = props.album?.photos || [];
    if (photos[currentIndex]) {
      emit('slideChange', photos[currentIndex]);
    }
  });
};

const handleZoomChange = (_swiper: SwiperInner, scale: number) => {
  currentZoomScale.value = scale;
  if (swiperRef.value) {
    swiperRef.value.allowTouchMove = scale <= 1.01;
  }
};

const slideNext = () => {
  swiperRef.value?.slideNext();
};

const slidePrev = () => {
  swiperRef.value?.slidePrev();
};

watch(
  () => props.album?.id,
  () => {
    if (swiperRef.value) {
      resetZoomState(swiperRef.value);
    }
  }
);
</script>

<style lang="less" scoped>
@import '../assets/less/variant.less';

.album-modal-slider-item {
  overflow: hidden;
}

.swiper-zoom-container {
  width: 100%;
  height: 100%;
}

.album-modal-slider-container:hover {
  .left-arrow,
  .right-arrow {
    opacity: 0.8;
  }
}

.left-arrow,
.right-arrow {
  left: 18px;
  top: 50%;
  border-radius: 50%;
  position: absolute;
  height: 32px;
  width: 32px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(32px);
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease-out;
}

.right-arrow {
  left: unset;
  right: 18px;
}

.swiper-wrapper {
  transition-timing-function: cubic-bezier(0.76, 0.09, 0.215, 1);
}

@media (max-width: 768px) {
  .left-arrow,
  .right-arrow {
    display: none;
  }

  .album-modal-slider-container :deep(.swiper-slide-zoomed) {
    cursor: grab;
  }
}
</style>
