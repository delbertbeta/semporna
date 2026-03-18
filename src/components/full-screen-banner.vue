<template>
  <div class="full-screen-banner fade-in">
    <button
      v-if="isMobile"
      class="hamburger-btn"
      @click="toggleMobileDrawer"
    >
      <span>&#9776;</span>
    </button>
    <swiper
      class="full-screen-banner-slider"
      :space-between="-36"
      :autoplay="{ delay: 10000 }"
      :modules="modules"
      loop
      @autoplayTimeLeft="onAutoplayTimeLeft"
      @swiper="handleSwiper"
      :speed="720"
      :simulate-touch="isMobile"
      :loop-additional-slides="3"
    >
      <swiper-slide v-for="album in targetAlbums" :key="album.id">
        <div class="full-screen-banner-slider-item">
          <div class="info-tag">
            <div class="into-year">
              {{ dayjs(album.date).format('YYYY/MM') }}
            </div>
          </div>
          <img
            class="full-screen-banner-img"
            :src="album.poster.objectPath"
            @click="handleBannerClick(album)"
          />
        </div>
      </swiper-slide>

      <template #container-end>
        <div class="autoplay-progress">
          <div class="autoplay-progress-bar" ref="progressBar" />
        </div>
      </template>
    </swiper>
    <div class="left-arrow" @click="slidePrev">
      <svg-icon name="left" :width="16" :height="16" class="arrow-icon" />
    </div>
    <div class="right-arrow" @click="slideNext">
      <svg-icon name="right" :width="16" :height="16" class="arrow-icon" />
    </div>
    <div class="scroll-down">
      <div class="scroll-down-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperInner } from 'swiper';
import { throttle } from 'lodash';
import { Autoplay } from 'swiper/modules';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store';
import dayjs from 'dayjs';
import 'swiper/css';

import { computed, ref, watch } from 'vue';
import { AlbumMeta } from '@/typings';
import { useAlbumStore } from '@/store/album';
import { useScrollOffset } from '@/composables/useScrollOffset';

const albumStore = useAlbumStore();
const appStore = useAppStore();
const { toggleMobileDrawer } = appStore;
const { isAnyModalOpen } = storeToRefs(appStore);
const { isMobile } = useScrollOffset();
const { albums } = storeToRefs(albumStore);
const modules = [Autoplay];
const swiperRef = ref<SwiperInner>();
const progressBar = ref<HTMLDivElement>();

const targetAlbums = computed(() => albums.value.slice(0, 3));

const handleSwiper = (swiper: SwiperInner) => {
  swiperRef.value = swiper;
};

const onAutoplayTimeLeft = throttle(
  (_swiper: SwiperInner, _timeLeft: number, percentage: number) => {
    if (!progressBar.value) {
      return;
    }
    progressBar.value.style.width = `${(1 - percentage) * 100}%`;
  },
  100,
  { trailing: true, leading: true }
);

const slideNext = () => {
  swiperRef.value?.slideNext();
};

const slidePrev = () => {
  swiperRef.value?.slidePrev();
};

const handleBannerClick = (album: AlbumMeta) => {
  appStore.openAlbumModal(album);
};

watch(isAnyModalOpen, (newValue) => {
  if (newValue) {
    swiperRef.value?.autoplay.stop();
  } else {
    swiperRef.value?.autoplay.start();
  }
});
</script>

<style lang="less" scoped>
@import '../assets/less/variant.less';

.full-screen-banner {
  height: 100%;
  width: 100%;
  overflow: hidden;

  position: relative;
}

.full-screen-banner-slider {
  z-index: 0;
  overflow: visible;
  position: absolute;
  top: 140px;
  left: 420px;
  right: 0;
  bottom: 80px;
}

.full-screen-banner-slider-item {
  height: 100%;
  width: calc(100% - 64px);

  & > .full-screen-banner-img {
    cursor: pointer;
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
}

.swiper-slide-active {
  .info-tag {
    opacity: 1;
    transform: translateY(0px);
  }
}

.info-tag {
  position: absolute;
  top: -64px;
  left: 32px;
  opacity: 0;
  transform: translateY(20px);

  transition: opacity 0.42s ease-in-out 0.3s, transform 0.42s ease-in-out 0.3s;

  .into-year {
    font-size: 96px;
    font-weight: lighter;
  }

  .into-bar {
    margin-top: 8px;
    font-size: 18px;
  }

  .into-pos {
    padding: 4px 12px;
    display: inline-block;
    background-color: @ui-color-secondary;
    color: white;
  }

  .info-des {
    padding: 4px 12px;
    background-color: white;
    display: inline-block;
  }
}

.scroll-down {
  position: absolute;
  left: 360px;
  right: 0;
  bottom: 36px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  opacity: 0.3;

  .scroll-down-icon {
    height: 3px;
    width: 60px;
    border-radius: 2px;
    background-color: black;
    animation: both swipeout 3s infinite ease-in-out;
  }
}

@keyframes swipeout {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }

  30%,
  70% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-10px);
    opacity: 0;
  }
}

.left-arrow,
.right-arrow {
  left: 378px;
  top: 50%;
  border-radius: 50%;
  position: absolute;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(32px);
  cursor: pointer;
}

.right-arrow {
  left: unset;
  right: 18px;
}

.swiper-wrapper {
  transition-timing-function: cubic-bezier(0.76, 0.09, 0.215, 1);
}

.autoplay-progress {
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: -20px;
  right: 64px;
  height: 4px;
  width: 80px;
  border-radius: 2px;
  overflow: hidden;
}

.autoplay-progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: width 0.1s ease;
}

.hamburger-btn {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(8px);
    color: white;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
  }
}

@media (max-width: 768px) {
  .left-arrow,
  .right-arrow {
    display: none;
  }

  .scroll-down {
    display: none;
  }

  .full-screen-banner {
    height: 55vw;
  }

  .full-screen-banner-slider {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .autoplay-progress {
    top: unset;
    bottom: 8px;
    right: 50%;
    transform: translateX(50%);
  }

  // 将日期标签移到 Banner 底部左侧
  .swiper-slide-active .info-tag {
    top: unset;
    bottom: 14px;
    left: 14px;
    opacity: 1;
    transform: translateY(0);
  }

  .info-tag {
    top: unset;
    bottom: 14px;
    left: 14px;
  }

  .into-year {
    font-size: 18px;
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }
}
</style>
