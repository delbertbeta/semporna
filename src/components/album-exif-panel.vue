<template>
  <div class="exif-panel-shell" :class="{ mobile }">
    <button
      v-if="mobile"
      class="mobile-exif-close"
      type="button"
      @click="emit('close')"
    >
      <XMarkIcon class="size-4" />
    </button>
    <div class="exif-panel-card">
      <div class="exif-panel-time">
        {{
          photo?.image.exif.dateTime
            ? new Date(photo.image.exif.dateTime).toLocaleString()
            : '未知拍摄时间'
        }}
      </div>
      <div class="exif-panel-device">
        <ViewfinderCircleIcon class="size-4 mt-0.5" />
        <div class="exif-panel-device-text">
          <div>{{ photo?.image.exif.model || '未知相机' }}</div>
          <div>{{ photo?.image.exif.lens || '未知镜头' }}</div>
        </div>
      </div>
      <div class="exif-divider" />
      <div class="exif-params">
        <div class="photo-params-item">
          {{ photo?.image.exif.fNumber || 'ƒ -' }}
        </div>
        <div class="photo-params-item">
          {{ photo?.image.exif.focalLength || '- mm' }}
        </div>
        <div class="photo-params-item">
          {{ photo?.image.exif.iso || 'ISO -' }}
        </div>
        <div class="photo-params-item">
          {{ photo?.image.exif.ev || '- ev' }}
        </div>
        <div class="photo-params-item">
          {{ photo?.image.exif.exposureTime || '- s' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon, ViewfinderCircleIcon } from '@heroicons/vue/24/outline';
import { AlbumRes } from '@/typings';

defineProps<{
  photo?: AlbumRes['photos'][0] | null;
  mobile?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style lang="less" scoped>
.exif-panel-shell {
  position: relative;
}

.exif-panel-card {
  border-radius: 10px;
  background: #fff;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
}

.exif-panel-time {
  color: #2f4530;
  background: rgba(111, 151, 95, 0.16);
  min-height: 28px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 700;
  line-height: 28px;
}

.exif-panel-device {
  display: flex;
  align-items: flex-start;
  padding: 10px 12px 8px;
  color: #20262e;
}

.exif-panel-device-text {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
}

.exif-divider {
  height: 1px;
  margin: 0 12px;
  background: rgba(31, 41, 55, 0.12);
}

.exif-params {
  display: flex;
  margin: 6px 12px 10px;
  font-size: 13px;
  font-weight: 500;
  color: #20262e;
}

.photo-params-item {
  flex-grow: 1;
  text-align: center;
  position: relative;

  &:first-of-type {
    text-align: left;
  }

  &:not(:last-of-type)::after {
    content: '';
    position: absolute;
    height: 70%;
    width: 1px;
    right: 0;
    top: 15%;
    opacity: 0.6;
    background: rgba(31, 41, 55, 0.12);
  }

  &:last-of-type {
    text-align: right;
  }
}

.mobile-exif-close {
  position: absolute;
  top: 4px;
  right: 8px;
  z-index: 1;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 9999px;
  background: rgba(17, 24, 39, 0.08);
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exif-panel-shell.mobile {
  .exif-panel-card {
    width: 100%;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(20px) saturate(135%);
    -webkit-backdrop-filter: blur(20px) saturate(135%);
  }

  .exif-panel-time {
    min-height: 32px;
    padding-right: 40px;
    line-height: 32px;
  }

  .exif-panel-device {
    padding-top: 12px;
  }

  .exif-params {
    font-size: 12px;
    gap: 8px;
    flex-wrap: wrap;
  }

  .photo-params-item {
    min-width: calc(50% - 4px);
    text-align: left;
    flex-grow: 0;

    &:first-of-type,
    &:last-of-type {
      text-align: left;
    }

    &::after {
      display: none;
    }
  }
}
</style>
