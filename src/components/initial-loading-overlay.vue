<template>
  <transition name="overlay-fade">
    <div v-if="visible" class="initial-loading-overlay">
      <loading-placeholder :loading="visible" theme="white" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import LoadingPlaceholder from './loading-placeholder.vue';

const props = defineProps<{
  loading: boolean;
}>();

const MIN_DISPLAY_MS = 1000;

const visible = ref(props.loading);
const shownAt = ref(props.loading ? Date.now() : 0);
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
};

watch(
  () => props.loading,
  (nextLoading) => {
    if (nextLoading) {
      clearHideTimer();
      shownAt.value = Date.now();
      visible.value = true;
      return;
    }

    const elapsed = Date.now() - shownAt.value;
    const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);

    clearHideTimer();

    if (remaining === 0) {
      visible.value = false;
      return;
    }

    hideTimer = setTimeout(() => {
      visible.value = false;
      hideTimer = null;
    }, remaining);
  }
);

onBeforeUnmount(() => {
  clearHideTimer();
});
</script>

<style lang="less" scoped>
.initial-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.45s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.overlay-fade-enter-to,
.overlay-fade-leave-from {
  opacity: 1;
}
</style>
