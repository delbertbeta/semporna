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
import { computed, onUnmounted, ref, watch } from 'vue';
import LoadingPlaceholder from './loading-placeholder.vue';
import {
  getInitialModalEntered,
  getRealModalLoading,
} from '@/utils/modal-loading';

const props = defineProps<{
  visible: boolean;
  loading?: boolean;
}>();

const entered = ref(getInitialModalEntered(props.visible));
const realLoading = computed(() => getRealModalLoading({
  entered: entered.value,
  loading: props.loading,
}));

const scrollLockState = {
  locked: false,
  scrollY: 0,
  htmlOverflow: '',
  htmlOverscrollBehavior: '',
  bodyOverflow: '',
  bodyPosition: '',
  bodyTop: '',
  bodyLeft: '',
  bodyRight: '',
  bodyWidth: '',
};

const lockDocumentScroll = () => {
  if (scrollLockState.locked || typeof window === 'undefined') {
    return;
  }

  const { body, documentElement } = document;

  scrollLockState.locked = true;
  scrollLockState.scrollY = window.scrollY;
  scrollLockState.htmlOverflow = documentElement.style.overflow;
  scrollLockState.htmlOverscrollBehavior = documentElement.style.overscrollBehavior;
  scrollLockState.bodyOverflow = body.style.overflow;
  scrollLockState.bodyPosition = body.style.position;
  scrollLockState.bodyTop = body.style.top;
  scrollLockState.bodyLeft = body.style.left;
  scrollLockState.bodyRight = body.style.right;
  scrollLockState.bodyWidth = body.style.width;

  documentElement.style.overflow = 'hidden';
  documentElement.style.overscrollBehavior = 'none';
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollLockState.scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
};

const unlockDocumentScroll = () => {
  if (!scrollLockState.locked || typeof window === 'undefined') {
    return;
  }

  const { body, documentElement } = document;

  documentElement.style.overflow = scrollLockState.htmlOverflow;
  documentElement.style.overscrollBehavior = scrollLockState.htmlOverscrollBehavior;
  body.style.overflow = scrollLockState.bodyOverflow;
  body.style.position = scrollLockState.bodyPosition;
  body.style.top = scrollLockState.bodyTop;
  body.style.left = scrollLockState.bodyLeft;
  body.style.right = scrollLockState.bodyRight;
  body.style.width = scrollLockState.bodyWidth;
  window.scrollTo(0, scrollLockState.scrollY);

  scrollLockState.locked = false;
};

const handleAfterEnter = () => {
  entered.value = true;
};

const handleAfterLeave = () => {
  entered.value = false;
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      lockDocumentScroll();
      return;
    }

    entered.value = false;
    unlockDocumentScroll();
  },
  {
    immediate: true,
  }
);

onUnmounted(() => {
  unlockDocumentScroll();
});
</script>

<style lang="less" scoped>
.mobile-modal-container {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #212121;
  overflow: hidden;
  overscroll-behavior: contain;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-sizing: border-box;
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
