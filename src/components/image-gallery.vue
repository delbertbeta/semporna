<template>
  <div class="scroll-wrapper">
    <full-screen-banner />
    <image-list />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import ImageList from './image-list.vue';
import FullScreenBanner from './full-screen-banner.vue';
</script>

<style lang="less">
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.fade-in {
  animation: fade-in 1s ease-in 0s backwards;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    visibility: hidden;
  }

  100% {
    opacity: 1;
    visibility: visible;
  }
}
</style>