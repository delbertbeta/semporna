<template>
  <div class="image-item-hover-meta">
    <div class="meta-bg-container">
      <div class="text-container">
        <div class="stamp-month">{{ dayJsObj.format('MM') }}</div>
        <div class="stamp-year">{{ dayJsObj.format('YYYY') }}</div>
        <div class="top-divider" />
        <div class="stamp-from">From:</div>
        <div class="stamp-from-city">{{ item.mainArea }}</div>
        <div class="stamp-from-pos">{{ item.subArea }}</div>
        <div class="bottom-divider" />
      </div>
      <svg-icon name="stamp-bg" class="stamp-bg" />
    </div>
    <svg-icon name="stamp.min" class="stamp" :height="120" :width="120" />
  </div>
</template>

<script setup lang="ts">
import { AlbumMeta } from '@/typings';
import dayjs from 'dayjs';
import { computed } from 'vue';

const props = defineProps<{ item: AlbumMeta }>();

const dayJsObj = computed(() => dayjs(props.item.date));
</script>

<style lang="less">
@import '../assets/less/variant.less';

.image-item-hover-meta {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(32px);

  &.v-enter-active,
  &.v-leave-active {
    transition: opacity 0.3s ease;
  }

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;
  }
}

.stamp {
  z-index: 1;
  position: absolute;
  right: 0;
  top: 0;
}

.meta-bg-container {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
}

.stamp-bg {
  position: absolute;
  z-index: -1;
  width: calc(100% - 48px) !important;
  max-width: calc(100% - 48px) !important;
  height: calc(100% - 48px) !important;
  max-height: calc(100% - 48px) !important;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;

  svg {
    max-height: 100% !important;
    max-width: 100% !important;
    height: 100%;
    width: 100%;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}

.stamp-month {
  margin-left: @margin;
  font-size: 28px;
  font-weight: bold;
  color: @ui-color-primary;
}

.stamp-year {
  margin-top: 2px;
  font-size: 14px;
  margin-left: @margin;
  font-weight: bold;
  color: @ui-color-secondary;
  margin-bottom: 12px;
}

.text-container {
  aspect-ratio: 1 / 1;
  max-width: calc(100% - 48px) !important;
  height: calc(100% - 48px);
  width: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  justify-content: center;
}

@margin: 10%;

.top-divider,
.bottom-divider {
  height: 2px;
  margin-left: @margin;
  margin-right: @margin;
  background-color: @ui-color-secondary;
  margin-top: 4px;
}

.stamp-from {
  margin-top: 8px;
  font-size: 12px;
  margin-left: @margin;
  font-weight: bold;
  color: @ui-color-secondary;
}

.stamp-from-city {
  margin-top: 4px;
  font-size: 14px;
  margin-left: @margin;
  font-weight: bold;
  color: @ui-color-primary;
}

.stamp-from-pos {
  margin-top: 4px;
  font-size: 16px;
  margin-left: @margin;
  font-weight: bold;
  color: @ui-color-primary;
  margin-bottom: 8px;
}
</style>
