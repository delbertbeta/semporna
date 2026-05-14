<template>
  <div class="toolbar-container">
    <transition name="live-photo-control">
      <div v-if="isLivePhoto" class="live-photo-control">
        <button class="button" type="button" @click="emit('livePhotoReplay')">
          <svg-icon name="live-photo" :width="20" :height="20" />
        </button>
        <div class="live-photo-menu">
          <label class="live-photo-menu-item">
            <span>静音</span>
            <input
              type="checkbox"
              :checked="livePhotoMuted"
              @change="handleMutedChange"
            />
          </label>
          <label class="live-photo-menu-item">
            <span>自动播放</span>
            <input
              type="checkbox"
              :checked="livePhotoAutoplay"
              @change="handleAutoplayChange"
            />
          </label>
        </div>
      </div>
    </transition>
    <div class="button" @click="emit('fullScreenClick')">
      <ArrowsPointingOutIcon class="size-5" />
    </div>
    <Popover v-slot="{ open }">
      <!-- Use the `open` state to conditionally change the direction of the chevron icon. -->
      <PopoverButton class="outline-none">
        <div class="button" :class="{ active: open }">
          <ExclamationCircleIcon class="size-5" />
        </div>
      </PopoverButton>
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel
          class="absolute left-1/2 z-10 mt-3 -translate-x-[87%] w-80"
        >
          <album-exif-panel :photo="photo" />
        </PopoverPanel>
      </transition>
    </Popover>
    <!-- <div class="button">
      <HeartIcon class="size-5" />
      23
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import {
  ArrowsPointingOutIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline';
import { AlbumRes } from '@/typings';
import AlbumExifPanel from './album-exif-panel.vue';
import { computed } from 'vue';
import { hasLivePhoto } from '@/utils/live-photo';

const props = defineProps<{
  photo?: AlbumRes['photos'][0] | null;
  livePhotoMuted: boolean;
  livePhotoAutoplay: boolean;
}>();

const emit = defineEmits<{
  (e: 'fullScreenClick'): void;
  (e: 'livePhotoReplay'): void;
  (e: 'update:livePhotoMuted', value: boolean): void;
  (e: 'update:livePhotoAutoplay', value: boolean): void;
}>();

const isLivePhoto = computed(() => hasLivePhoto(props.photo));

const getChecked = (event: Event) => {
  return (event.target as HTMLInputElement).checked;
};

const handleMutedChange = (event: Event) => {
  emit('update:livePhotoMuted', getChecked(event));
};

const handleAutoplayChange = (event: Event) => {
  emit('update:livePhotoAutoplay', getChecked(event));
};
</script>

<style lang="less" scoped>
@import '../assets/less/variant.less';

.toolbar-container {
  position: absolute;
  z-index: 2;
  right: 24px;
  top: 24px;
  display: flex;
  gap: 16px;
}

.button {
  border: 0;
  padding: 6px;
  height: 32px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-weight: bold;

  background-color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  border-radius: 6px;
  backdrop-filter: blur(6px);
  color: @ui-color-divider;

  &:hover,
  &.active {
    background-color: rgba(255, 255, 255, 0.9);
  }
}

.live-photo-control {
  position: relative;
}

.live-photo-control::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 8px;
}

.live-photo-control:hover .button {
  background-color: rgba(255, 255, 255, 0.9);
}

.live-photo-control:hover .live-photo-menu {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.live-photo-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 152px;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: all 0.16s ease-out;
}

.live-photo-control-enter-active,
.live-photo-control-leave-active {
  transition:
    opacity 720ms cubic-bezier(0.76, 0.09, 0.215, 1),
    transform 720ms cubic-bezier(0.76, 0.09, 0.215, 1);
}

.live-photo-control-enter-from,
.live-photo-control-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.live-photo-control-enter-to,
.live-photo-control-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.live-photo-menu-item {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: @ui-color-divider;
  font-size: 13px;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: @ui-color-divider;
    cursor: pointer;
  }
}
</style>
