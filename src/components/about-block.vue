<template>
  <div class="about-block" :class="{ 'no-blur': isAnyModalOpen }">
    <div>
      <div class="logo-box">
        <img class="logo" src="../assets/img/logo.png" />
        <div class="desc">
          <div class="top-text">All about</div>
          <div class="bottom-text">Delbert &amp; Shyrii</div>
        </div>
      </div>
      <div class="line"></div>
      <div class="about-text pointer" @click="openAboutModal">
        关于这里
        <svg-icon
          name="link"
          :width="16"
          :height="16"
          style="margin-left: 8px"
        ></svg-icon>
      </div>
    </div>

    <timeline-block />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';
import TimelineBlock from './timeline-block.vue';

const store = useAppStore();

const { openAboutModal } = store;
const { isAnyModalOpen } = storeToRefs(store);
</script>

<style lang="less" scoped>
.about-block {
  position: absolute;
  box-sizing: border-box;
  width: 360px;
  height: 100%;
  padding: 42px;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg, #edecea 0%, rgba(237, 236, 234, 0.6) 100%);
  backdrop-filter: blur(32px);
  transition: backdrop-filter 0.3s ease;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;

  &.no-blur {
    backdrop-filter: none;
  }

  .logo-box {
    display: flex;
    align-items: center;

    .logo {
      width: 80px;
      height: 80px;
      margin-right: 24px;
    }

    .desc {
      font-weight: bold;

      .top-text {
        font-size: 36px;
        font-weight: 700;
      }

      .bottom-text {
        font-size: 20px;
      }
    }
  }

  .line {
    width: 220px;
    border: 1.5px solid #757c8a;
    margin: 24px 0;
  }

  .about-text {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: normal;
  }
}
</style>
