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
      <swiper-slide>
        <div
          class="album-modal-slider-item flex items-center justify-center w-full h-full"
        >
          <img
            id="image-id-1"
            class="album-modal-img object-contain max-h-full max-w-full h-full w-full"
            :src="testImage2"
          />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div
          class="album-modal-slider-item flex items-center justify-center w-full h-full"
        >
          <img
            class="album-modal-img object-contain max-h-full max-w-full h-full w-full"
            :src="testImage2"
          />
        </div>
      </swiper-slide>

      <swiper-slide>
        <div
          class="album-modal-slider-item flex items-center justify-center w-full h-full"
        >
          <img
            class="album-modal-img object-contain max-h-full max-w-full h-full w-full"
            :src="testImage1"
          />
        </div>
      </swiper-slide>
    </swiper>
    <div class="left-arrow" @click="slidePrev">
      <svg-icon name="left" :width="16" :height="16" class="arrow-icon" />
    </div>
    <div class="right-arrow" @click="slideNext">
      <svg-icon name="right" :width="16" :height="16" class="arrow-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperInner } from 'swiper';
import 'swiper/css';

import { testImage1 } from '@/mockData/testData';
import { testImage2 } from '@/mockData/testData';
import { ref } from 'vue';

const swiperRef = ref<SwiperInner>();

const handleSwiper = (swiper: SwiperInner) => {
  swiperRef.value = swiper;
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
