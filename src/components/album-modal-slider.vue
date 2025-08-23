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
          <img
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

import { ref } from 'vue';
import { AlbumRes } from '@/typings';
import { matchImageUrl } from '@/utils';

const emit = defineEmits<{
  (e: 'slideChange', photo: AlbumRes['photos'][0]): void;
}>();

const props = defineProps<{
  album: AlbumRes | null;
}>();

const swiperRef = ref<SwiperInner>();

const handleSwiper = (swiper: SwiperInner) => {
  swiperRef.value = swiper;
  swiper.on('slideChange', () => {
    const currentIndex = swiper.realIndex;
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
