<template>
  <div
    class="full-screen-banner fade-in"
    :class="{
      'is-mobile-banner-transitioning': isBannerTransitioning,
      'is-mobile-banner-swiping': isBannerSwiping,
    }"
  >
    <swiper
      class="full-screen-banner-slider"
      :space-between="isMobile ? 0 : -36"
      :autoplay="{ delay: 10000 }"
      :modules="modules"
      loop
      @autoplayTimeLeft="onAutoplayTimeLeft"
      @swiper="handleSwiper"
      @slideChangeTransitionStart="beginMobileBannerTransition"
      @slideChangeTransitionEnd="endMobileBannerTransition"
      @sliderFirstMove="beginMobileBannerSwipe"
      @touchMoveOpposite="cancelMobileBannerTransition"
      @touchEnd="settleMobileBannerTransition"
      :speed="720"
      :simulate-touch="isMobile"
      :loop-additional-slides="3"
    >
      <swiper-slide v-for="album in targetAlbums" :key="album.id">
        <div class="full-screen-banner-slider-item">
          <div class="info-tag-backdrop" />
          <div class="info-tag">
            <div class="info-tag-text">
              <div class="into-year">
                {{ dayjs(album.date).format('YYYY/MM') }}
              </div>
              <div v-if="album.subArea || album.mainArea" class="into-location">
                {{ formatAlbumLocation(album) }}
              </div>
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

import { computed, onUnmounted, ref, watch } from 'vue';
import { AlbumMeta } from '@/typings';
import { useAlbumStore } from '@/store/album';
import { useScrollOffset } from '@/composables/useScrollOffset';

const albumStore = useAlbumStore();
const appStore = useAppStore();
const { isAnyModalOpen } = storeToRefs(appStore);
const { isMobile } = useScrollOffset();
const { albums } = storeToRefs(albumStore);
const modules = [Autoplay];
const swiperRef = ref<SwiperInner>();
const progressBar = ref<HTMLDivElement>();
const isBannerTransitioning = ref(false);
const isBannerSwiping = ref(false);
let bannerTransitionTimer: ReturnType<typeof setTimeout> | undefined;

const targetAlbums = computed(() => albums.value.slice(0, 3));

const formatAlbumLocation = (album: AlbumMeta) => {
  if (album.subArea && album.mainArea) {
    return `${album.subArea}, ${album.mainArea}`;
  }

  return album.subArea || album.mainArea || '';
};

const clearBannerTransitionTimer = () => {
  if (bannerTransitionTimer) {
    clearTimeout(bannerTransitionTimer);
    bannerTransitionTimer = undefined;
  }
};

const beginMobileBannerTransition = () => {
  if (!isMobile.value) {
    return;
  }

  clearBannerTransitionTimer();
  isBannerTransitioning.value = true;
};

const beginMobileBannerSwipe = () => {
  if (!isMobile.value) {
    return;
  }

  clearBannerTransitionTimer();
  isBannerSwiping.value = true;
  isBannerTransitioning.value = true;
};

const settleMobileBannerTransition = () => {
  if (!isMobile.value) {
    return;
  }

  clearBannerTransitionTimer();
  bannerTransitionTimer = setTimeout(() => {
    isBannerTransitioning.value = false;
    isBannerSwiping.value = false;
    bannerTransitionTimer = undefined;
  }, 140);
};

const endMobileBannerTransition = () => {
  settleMobileBannerTransition();
};

const cancelMobileBannerTransition = () => {
  if (!isMobile.value) {
    return;
  }

  clearBannerTransitionTimer();
  isBannerTransitioning.value = false;
  isBannerSwiping.value = false;
};

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
  beginMobileBannerTransition();
  swiperRef.value?.slideNext();
};

const slidePrev = () => {
  beginMobileBannerTransition();
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

onUnmounted(() => {
  clearBannerTransitionTimer();
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
  position: relative;
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
  z-index: 2;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;

    transition:
      opacity 0.42s ease-in-out 0.3s,
      transform 0.42s ease-in-out 0.3s;

  .into-year {
    font-size: 96px;
    font-weight: lighter;
  }

  .into-location {
    display: none;
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

.info-tag-backdrop {
  display: none;
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
  z-index: 3;
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

@media (max-width: 768px) {
  .left-arrow,
  .right-arrow {
    display: none;
  }

  .full-screen-banner-slider-item {
    width: 100%;
  }

  .scroll-down {
    display: none;
  }

  .full-screen-banner {
    height: 100vh;
    height: 100dvh;
    display: block;
    box-sizing: border-box;
    padding-top: calc(env(safe-area-inset-top) + 46px);
  }

  .full-screen-banner-slider {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    bottom: auto;
    width: 100%;
    min-height: 0;
    height: 100%;
    overflow: hidden;
  }

  .full-screen-banner-slider-item > .full-screen-banner-img {
    border-radius: 0;
    transform: scale(1);
    transform-origin: center center;
    transition:
      border-radius 420ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 420ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  .is-mobile-banner-transitioning .full-screen-banner-slider-item > .full-screen-banner-img {
    border-radius: 64px;
    transform: scale(0.8);
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
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.2s, 0.2s;
  }

  .info-tag {
    top: unset;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24px 16px 22px;
    z-index: 2;
  }

  .is-mobile-banner-swiping .info-tag {
    opacity: 0;
    transform: translateY(14px);
    transition-delay: 0s, 0s;
    transition-duration: 0.1s, 0.1s;
  }

  .info-tag-backdrop {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 112px;
    z-index: 1;
    opacity: 0;
    transform: scaleY(0.5);
    transform-origin: bottom center;
    background: rgba(18, 19, 21, 0.26);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 55%, rgba(0, 0, 0, 0) 100%);
    -webkit-mask-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 1) 55%,
      rgba(0, 0, 0, 0) 100%
    );
    pointer-events: none;
    transition:
      opacity 0.35s ease-in-out,
      transform 0.35s ease-in-out;
  }

  .swiper-slide-active .info-tag-backdrop {
    opacity: 1;
    transform: scaleY(1);
    transition-delay: 0.2s, 0.2s;
  }

  .is-mobile-banner-swiping .info-tag-backdrop {
    opacity: 0;
    transform: scaleY(0.5);
    transition-delay: 0s, 0s;
    transition-duration: 0.1s, 0.1s;
  }

  .info-tag-text {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-tag .into-year {
    display: block;
    width: 100%;
    font-size: 20vw;
    letter-spacing: 0.08em;
    line-height: 1.1;
    color: white;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
  }

  .info-tag .into-location {
    display: block;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.25;
    color: rgba(255, 255, 255, 0.86);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  }

}
</style>
