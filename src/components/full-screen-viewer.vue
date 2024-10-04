<template>
  <Transition>
    <teleport to="body" v-if="image">
      <div
        class="fullscreen-viewer-container fixed w-full h-full top-0 left-0 backdrop-blur cursor-zoom-out"
        @click="onClose"
      >
        <div
          class="absolute right-10 top-10 rounded-full size-12 close-button flex justify-center items-center"
        >
          <x-mark-icon class="size-8 text-white" />
        </div>
        <img
          class="absolute transition-all duration-300 object-contain"
          :src="imageSrc"
          :style="overrideImageStyle ?? initialImageStyleProps"
        />
      </div>
    </teleport>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  image?: HTMLImageElement;
  onClose: () => void;
}>();

const imageSrc = computed(() => {
  return props.image?.src;
});

const imageRect = computed(() => {
  const rect = props.image?.getBoundingClientRect();
  if (!rect) {
    return {};
  }
  return { x: rect.x, y: rect.y, height: rect.height, width: rect.width };
});

const originImageRect = computed(() => {
  if (!props.image) {
    return {};
  }
  return {
    height: props.image.naturalHeight,
    width: props.image.naturalWidth,
  };
});

const initialImageStyleProps = computed(() => {
  const imageContainerRect = imageRect.value;
  const innerOriginImageRect = originImageRect.value;

  if (!imageContainerRect.height || !innerOriginImageRect.height) {
    return;
  }

  const originImageRatio =
    innerOriginImageRect.width / innerOriginImageRect.height;
  const imageContainerRatio =
    imageContainerRect.width / imageContainerRect.height;

  if (originImageRatio > imageContainerRatio) {
    const height = imageContainerRect.width / originImageRatio;
    return {
      height: height + 'px',
      width: imageContainerRect.width + 'px',
      left: imageContainerRect.x + 'px',
      top:
        imageContainerRect.y + (imageContainerRect.height - height) / 2 + 'px',
    };
  } else {
    const width = imageContainerRect.height * originImageRatio;
    return {
      height: imageContainerRect.height + 'px',
      width: width + 'px',
      left:
        imageContainerRect.x + (imageContainerRect.width - width) / 2 + 'px',
      top: imageContainerRect.y + 'px',
    };
  }
});

const overrideImageStyle = ref();

let timeout = 0;

watch(
  () => props.image,
  (image) => {
    if (!image) {
      window.clearTimeout(timeout);
      overrideImageStyle.value = null;
    } else {
      timeout = window.setTimeout(() => {
        overrideImageStyle.value = {
          left: '5%',
          top: '5%',
          height: '90%',
          width: '90%',
        };
      }, 50);
    }
  }
);
</script>

<style lang="less" scooped>
.fullscreen-viewer-container {
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 101;
}

.close-button {
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}

.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-leave-to {
  opacity: 0;
}
</style>
