<!-- src/components/sidebar-content.vue -->
<template>
  <div class="sidebar-content">
    <div class="logo-box">
      <img class="logo" src="../assets/img/logo.png" />
      <div class="desc">
        <div class="top-text">All about</div>
        <div class="bottom-text">Delbert &amp; Shyrii</div>
      </div>
    </div>
    <timeline-block />
  </div>
</template>

<script setup lang="ts">
import TimelineBlock from './timeline-block.vue';
</script>

<style lang="less" scoped>
.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.logo-box {
  display: flex;
  align-items: center;

  .logo {
    width: 80px;
    height: 80px;
    margin-right: 24px;

    // 移动端：缩小为圆形，适配抽屉窄空间
    @media (max-width: 768px) {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 16px;
    }
  }

  .desc {
    font-weight: bold;

    .top-text {
      font-size: 36px;
      font-weight: 700;

      @media (max-width: 768px) {
        font-size: 24px;
      }
    }

    .bottom-text {
      font-size: 20px;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }
  }
}
</style>
