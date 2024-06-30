<template>
  <div class="about-block">
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
      <svg-icon name="link" :width="16" :height="16" style="margin-left: 8px"></svg-icon>
    </div>

    <div class="timeline">
      <div class="timeline-item active">2024</div>
      <div class="timeline-item">2023</div>
      <div class="timeline-item">2022</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const store = useAppStore();

const { openAboutModal } = store;
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
  background: linear-gradient(90deg, #EDECEA 0%, rgba(237, 236, 234, 0.6) 100%);
  backdrop-filter: blur(32px);
  z-index: 1;

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
    border: 1.5px solid #757C8A;
    margin: 24px 0;
  }

  .about-text {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: normal;
  }

  .timeline {
    position: absolute;
    left: 42px;
    bottom: 42px;
  }

  .timeline-item {
    font-size: 16px;
    margin-top: 8px;
    cursor: pointer;
    color: #D3D3D5;

    font-weight: bold;

    &.active {
      color: #121315;
    }
  }
}
</style>