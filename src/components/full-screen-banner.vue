<template>
  <div class="full-screen-banner fade-in">
    <div class="full-screen-banner-slider">
      <div class="full-screen-banner-slider-item prev">
        <div class="info-tag">
          <div class="into-year">2024/08</div>
          <!-- <div class="into-bar"><span class="into-pos">广州</span><span class="info-des">test</span></div> -->
        </div>
        <img class="full-screen-banner-img prev" :src="testImage2" />
      </div>
      <div class="full-screen-banner-slider-item">
        <div class="info-tag">
          <div class="into-year">2024/08</div>
        </div>
        <img class="full-screen-banner-img" :src="testImage2" />
      </div>

      <div class="full-screen-banner-slider-item next">
        <div class="info-tag">
          <div class="into-year">2024/08</div>
        </div>
        <img class="full-screen-banner-img" :src="testImage1" />
      </div>
    </div>
    <div class="left-arrow">
      <svg-icon name="left" :width="16" :height="16" class="arrow-icon" />

    </div>
    <div class="right-arrow">
      <svg-icon name="right" :width="16" :height="16" class="arrow-icon" />
    </div>
    <div class="scroll-down">
      <div class="scroll-down-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { testImage1 } from '@/mockData/testData';
import { testImage2 } from '@/mockData/testData';

</script>

<style lang="less">
.full-screen-banner {
  height: 100%;
  width: 100%;
  overflow: hidden;

  position: relative;
}

.full-screen-banner-slider-item {
  position: absolute;
  top: 200px;
  left: 428px;
  right: 72px;
  bottom: 100px;

  &.prev {
    transform: translateX(calc(-100% - 36px));
  }

  &.next {
    transform: translateX(calc(100% + 36px));
  }

  &>.full-screen-banner-img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}

.info-tag {
  position: absolute;
  top: -64px;
  left: 32px;

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
    background-color: #2B4E20;
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
</style>
