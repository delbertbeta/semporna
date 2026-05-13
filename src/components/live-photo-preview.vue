<template>
  <video
    v-if="photo?.image.livePhoto?.videoPath"
    ref="videoRef"
    class="live-photo-video"
    :class="{ visible: isPlaying, cover }"
    :key="replayKey"
    :src="photo.image.livePhoto.videoPath"
    :muted="muted"
    playsinline
    preload="metadata"
    @play="isPlaying = true"
    @pause="isPlaying = false"
    @ended="handleEnded"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { AlbumRes } from '@/typings';
import {
  canAutoplayLivePhoto,
  getLivePhotoReplayKey,
} from '@/utils/live-photo';

const props = defineProps<{
  photo: AlbumRes['photos'][0];
  active: boolean;
  muted: boolean;
  autoplay: boolean;
  playSignal: number;
  cover?: boolean;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const autoplayedKey = ref<string | null>(null);

const replayKey = computed(() =>
  getLivePhotoReplayKey(props.photo.id, props.playSignal)
);

const resetAndPlay = async () => {
  await nextTick();
  const video = videoRef.value;
  if (!video || !props.active) {
    return;
  }

  video.currentTime = 0;
  try {
    await video.play();
  } catch {
    isPlaying.value = false;
  }
};

const stopPreview = () => {
  const video = videoRef.value;
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  isPlaying.value = false;
};

const handleEnded = () => {
  isPlaying.value = false;
};

watch(
  () => [props.active, props.photo.id, props.photo.image.livePhoto?.videoPath],
  () => {
    const autoplayKey = `${props.photo.id ?? 'unknown'}:${props.photo.image.livePhoto?.videoPath ?? ''}`;
    if (!props.active) {
      stopPreview();
      return;
    }

    if (
      autoplayedKey.value !== autoplayKey &&
      canAutoplayLivePhoto(props.photo, props.autoplay)
    ) {
      autoplayedKey.value = autoplayKey;
      void resetAndPlay();
    }
  },
  { immediate: true }
);

watch(
  () => props.playSignal,
  () => {
    if (props.active) {
      void resetAndPlay();
    }
  }
);
</script>

<style scoped lang="less">
.live-photo-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.16s ease-out;

  &.cover {
    object-fit: cover;
  }

  &.visible {
    opacity: 1;
  }
}
</style>
