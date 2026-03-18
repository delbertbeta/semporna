<!-- src/components/mobile-modal-wrapper.vue -->
<template>
  <transition
    name="mobile-modal"
    :duration="{ enter: 400, leave: 350 }"
    @after-enter="handleAfterEnter"
    @after-leave="handleAfterLeave"
  >
    <div class="mobile-modal-container" v-if="visible">
      <loading-placeholder :loading="realLoading" />
      <slot></slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import LoadingPlaceholder from './loading-placeholder.vue';

const props = defineProps<{
  visible: boolean;
  loading?: boolean;
}>();

const entered = ref(false);
const realLoading = computed(() => !entered.value || props.loading);

const handleAfterEnter = () => {
  entered.value = true;
};

const handleAfterLeave = () => {
  entered.value = false;
};
</script>

<style lang="less" scoped>
.mobile-modal-container {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #212121;
  overflow: hidden;
}

.mobile-modal-enter-active {
  animation: slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1) both;
}

.mobile-modal-leave-active {
  animation: slide-down 0.35s cubic-bezier(0.32, 0.72, 0, 1) both;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
