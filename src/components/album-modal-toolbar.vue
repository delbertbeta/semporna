<template>
  <div class="toolbar-container">
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
          class="absolute left-1/2 z-10 mt-3 -translate-x-[85%] p-3 w-80 rounded-lg bg-white-transparent-2 backdrop-blur-sm"
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

defineProps<{
  photo?: AlbumRes['photos'][0] | null;
}>();

const emit = defineEmits<{
  (e: 'fullScreenClick'): void;
}>();
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

</style>
