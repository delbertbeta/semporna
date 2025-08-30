<template>
  <div class="album-modal-slider-container absolute w-full h-full">
    <swiper
      class="album-modal-slider w-full h-full"
      :space-between="0"
      @swiper="handleSwiper"
      :speed="720"
      :simulate-touch="false"
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
          <img
            v-show="imageLoadedState[photo.id!]"
            @load="imageLoadedState[photo.id!] = true"
            :id="`image-id-${photo.id}`"
            class="album-modal-img object-contain max-h-full max-w-full h-full w-full"
            :src="matchImageUrl(photo.image, 'higher', '1080p')"
          />
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
import 'swiper/css';
import LoadingPlaceholder from './loading-placeholder.vue';

import { ref, watchEffect, computed, watch } from 'vue';
import { AlbumRes } from '@/typings';
import { matchImageUrl } from '@/utils';

const emit = defineEmits<{
  (e: 'slideChange', photo: AlbumRes['photos'][0]): void;
  (e: 'image-loading-state', loading: boolean): void;
}>();

const props = defineProps<{
  album: AlbumRes | null;
}>();

const swiperRef = ref<SwiperInner>();
const currentSlideIndex = ref(0);

const imageLoadedState = ref<Record<number, boolean>>({});

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
    const currentIndex = swiper.realIndex;
    currentSlideIndex.value = Number.isNaN(currentIndex) ? 0 : currentIndex;
    const photos = props.album?.photos || [];
    if (photos[currentIndex]) {
      emit('slideChange', photos[currentIndex]);
    }
  });
};

const slideNext = () => {
  swiperRef.value?.slideNext();
};

const slidePrev = () => {
  swiperRef.value?.slidePrev();
};
</script>

<style lang="less" scoped>
@import '../assets/less/variant.less';

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
</style>
