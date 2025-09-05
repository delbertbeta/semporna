<template>
  <div class="inner-info-container">
    <div class="info-header">
      <div class="stamp-info-wrapper">
        <div class="stamp-info-from">From:</div>
        <div class="stamp-info-city">{{ album?.mainArea }}</div>
        <div class="stamp-info-pos">{{ album?.subArea }}</div>
      </div>
      <svg-icon name="stamp-full.min" class="stamp-full" :width="135" />
    </div>
    <transition name="fade" mode="out-in">
      <div class="info-text" :key="photo?.image.id">
        <div class="info-text-title">{{ photo?.title }}</div>
        <div class="info-text-description">
          {{ photo?.description }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { AlbumRes } from '@/typings';

defineProps<{
  photo: AlbumRes['photos'][0] | null;
  album: AlbumRes | null;
}>();
</script>

<style lang="less" scoped>
@import '../assets/less/variant.less';

.inner-info-container {
  height: 100%;
  width: 100%;
  padding: 38px 50px 42px;
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
}

.info-header {
  display: flex;
  gap: 18px;
  flex-shrink: 0;
}

.stamp-full {
  flex-shrink: 0;
}

.stamp-info-wrapper {
  flex: 1;
  width: 100%;
  padding: 8px 4px;

  border-top: 1px solid @ui-color-secondary;
  border-bottom: 1px solid @ui-color-secondary;
}

.stamp-info-from {
  color: @ui-color-secondary;
  font-size: 12px;
  font-weight: bold;
}

.stamp-info-city {
  margin-top: 4px;
  font-size: 14px;
  font-weight: bold;
  color: @ui-color-primary;
}

.stamp-info-pos {
  margin-top: 4px;
  font-size: 16px;
  font-weight: bold;
  color: @ui-color-primary;
}

.info-text {
  margin-top: 32px;
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.info-text-title {
  font-size: 24px;
  line-height: 1.3;
  text-underline-offset: 16px;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  font-weight: bold;
  margin-bottom: 24px;
}

.info-text-description {
  font-size: 16px;
  line-height: 3;
  text-underline-offset: 16px;
  text-decoration: underline #999;
}
</style>
