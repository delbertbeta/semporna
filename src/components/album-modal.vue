<template>
  <!-- 移动端 -->
  <mobile-modal-wrapper
    v-if="isMobile"
    :visible="showAlbumModal"
    :loading="loading"
  >
    <div
      class="album-modal-mobile"
      :class="{
        'mobile-info-expanded': isExpanded,
        'mobile-photo-zoomed': isMobilePhotoZoomed,
      }"
      :style="{
        '--mobile-info-panel-height': isExpanded
          ? 'clamp(280px, 34vh, 360px)'
          : '0px',
      }"
    >
      <!-- 照片 Swiper（始终全屏，cover 模式） -->
      <div class="mobile-photo-area">
        <album-modal-slider
          :album="albumDetail"
          :cover="false"
          @slideChange="handleSlideChange"
          @image-loading-state="handleImageLoadingState"
          @zoom-state-change="handleMobileZoomStateChange"
        />

        <!-- 顶部栏 -->
        <div class="mobile-top-bar">
          <span class="mobile-top-location">
            {{ albumDetail?.mainArea }}
            <template v-if="albumDetail?.subArea">
              · {{ albumDetail.subArea }}
            </template>
            <template v-if="albumDetail?.date">
              ·
              {{
                new Date(albumDetail.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                })
              }}
            </template>
          </span>
          <div class="mobile-top-actions">
            <button
              class="mobile-info-btn"
              type="button"
              @click.stop="toggleMobileExif"
            >
              <ExclamationCircleIcon class="size-4" />
            </button>
            <button
              class="mobile-close-btn"
              type="button"
              @click="handleCloseModal"
            >
              <XMarkIcon class="size-4" />
            </button>
          </div>
        </div>

        <transition name="mobile-exif-fade">
          <div
            v-if="showMobileExif"
            class="mobile-exif-overlay"
            @click="closeMobileExif"
          >
            <div class="mobile-exif-popover" @click.stop>
              <album-exif-panel
                mobile
                :photo="currentPhoto"
                @close="closeMobileExif"
              />
            </div>
          </div>
        </transition>

        <!-- 进度条 -->
        <div class="mobile-progress-bar">
          <div
            v-for="(photo, idx) in albumDetail?.photos || []"
            :key="photo.id"
            class="mobile-progress-segment"
            :class="{
              viewed: idx < currentSlideIndexMobile,
              current: idx === currentSlideIndexMobile,
            }"
          />
        </div>
      </div>

      <!-- Peek 栏（沉浸状态时显示，展开后隐藏） -->
      <div
        v-if="!isExpanded"
        ref="peekRef"
        class="mobile-peek-strip"
        @click.self="isExpanded = true"
      >
        <div class="peek-handle" />
        <div class="peek-content">
          <span class="peek-title">
            {{ currentPhoto?.title || albumDetail?.mainArea }}
          </span>
        </div>
      </div>

      <!-- 展开状态：信息面板 -->
      <transition name="info-slide">
        <div v-if="isExpanded" ref="infoPanelRef" class="mobile-info-panel">
          <div class="peek-handle" @click="isExpanded = false" />
          <div class="mobile-info-scroll">
            <svg-icon
              name="stamp-full.min"
              class="mobile-stamp-full"
              :width="104"
            />
            <div class="mobile-info-title">{{ currentPhoto?.title }}</div>
          </div>
          <div class="mobile-info-desc-scroll">
            <div class="mobile-info-desc">{{ currentPhoto?.description }}</div>
          </div>
        </div>
      </transition>
    </div>
  </mobile-modal-wrapper>

  <!-- 桌面端（原有代码不变） -->
  <modal
    v-else
    @close="handleCloseModal"
    :visible="showAlbumModal"
    :loading="loading"
    size="large"
  >
    <div class="album-modal">
      <div class="image-container">
        <album-modal-toolbar
          v-show="!isImageLoading"
          :photo="currentPhoto"
          @full-screen-click="handleFullScreenClick"
        />
        <album-modal-slider
          :album="albumDetail"
          @slideChange="handleSlideChange"
          @image-loading-state="handleImageLoadingState"
        />
      </div>
      <div class="info-container">
        <album-modal-info :photo="currentPhoto" :album="albumDetail" />
      </div>
      <full-screen-viewer @close="handleCloseViewer" :image="fullscreenImage" />
    </div>
  </modal>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import Modal from './modal.vue';
import AlbumModalToolbar from './album-modal-toolbar.vue';
import AlbumModalInfo from './album-modal-info.vue';
import AlbumModalSlider from './album-modal-slider.vue';
import AlbumExifPanel from './album-exif-panel.vue';
import fullScreenViewer from './full-screen-viewer.vue';
import { computed, ref, watch } from 'vue';
import { getAlbumById } from '@/request';
import { AlbumRes } from '@/typings';
import { useScrollOffset } from '@/composables/useScrollOffset';
import { useSwipe } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import MobileModalWrapper from './mobile-modal-wrapper.vue';
import { useThemeColor } from '@/composables/useThemeColor';
import {
  ALBUM_ROUTE_NAME,
} from '@/utils/album-route';
import { ALBUM_MODAL_THEME_COLOR } from '@/utils/browser-theme';

const store = useAppStore();
const { closeAlbumModal } = store;
const route = useRoute();

const { isMobile } = useScrollOffset();

const showAlbumModal = computed(() => route.name === ALBUM_ROUTE_NAME);
const albumRouteId = computed(() =>
  typeof route.params.albumId === 'string' ? route.params.albumId : undefined
);

const albumCache = new Map<string, AlbumRes>();
const loading = ref(false);
const albumDetail = ref<AlbumRes | null>(null);
const currentPhoto = ref<AlbumRes['photos'][0] | null>(null);
const isImageLoading = ref(true);
const activeAlbumRequestId = ref<string | null>(null);

// 移动端展开状态
const isExpanded = ref(false);
const currentSlideIndexMobile = ref(0);
const showMobileExif = ref(false);
const isMobilePhotoZoomed = ref(false);

// peek 栏 / info panel 的 swipe ref
const peekRef = ref<HTMLElement | null>(null);
const infoPanelRef = ref<HTMLElement | null>(null);

useThemeColor(
  ALBUM_MODAL_THEME_COLOR,
  computed(() => showAlbumModal.value)
);

// 向上滑动 peek 栏 → 展开
const { direction: peekSwipeDir } = useSwipe(peekRef, {
  threshold: 10,
  onSwipeEnd() {
    if (peekSwipeDir.value === 'up') {
      isExpanded.value = true;
    }
  },
});

// 向下滑动 info panel 把手 → 收起
const { direction: infoSwipeDir } = useSwipe(infoPanelRef, {
  threshold: 10,
  onSwipeEnd() {
    if (infoSwipeDir.value === 'down') {
      isExpanded.value = false;
    }
  },
});

const handleImageLoadingState = (loadingState: boolean) => {
  isImageLoading.value = loadingState;
};

const handleSlideChange = (photo: AlbumRes['photos'][0]) => {
  currentPhoto.value = photo;
  showMobileExif.value = false;
  isMobilePhotoZoomed.value = false;
  const idx = albumDetail.value?.photos?.findIndex((p) => p.id === photo.id);
  if (idx !== undefined && idx >= 0) {
    currentSlideIndexMobile.value = idx;
  }
};

const closeMobileExif = () => {
  showMobileExif.value = false;
};

const toggleMobileExif = () => {
  showMobileExif.value = !showMobileExif.value;
};

const handleMobileZoomStateChange = (zoomed: boolean) => {
  isMobilePhotoZoomed.value = zoomed;
};

const fetchAlbumDetail = async (id: string) => {
  activeAlbumRequestId.value = id;

  if (albumCache.has(id)) {
    loading.value = false;
    albumDetail.value = albumCache.get(id) || null;
    return;
  }

  loading.value = true;
  try {
    const res = await getAlbumById(id);
    if (activeAlbumRequestId.value !== id) {
      return;
    }

    if (res.data.data.album) {
      albumCache.set(id, res.data.data.album);
      albumDetail.value = res.data.data.album;
      return;
    }

    albumDetail.value = null;
    await closeAlbumModal();
  } catch (error) {
    console.error('Failed to fetch album detail:', error);
    if (activeAlbumRequestId.value === id) {
      albumDetail.value = null;
      await closeAlbumModal();
    }
  } finally {
    if (activeAlbumRequestId.value === id) {
      loading.value = false;
    }
  }
};

watch(
  albumRouteId,
  (albumId) => {
    currentSlideIndexMobile.value = 0;
    isExpanded.value = false;
    showMobileExif.value = false;
    isMobilePhotoZoomed.value = false;
    currentPhoto.value = null;
    isImageLoading.value = true;

    if (!albumId) {
      activeAlbumRequestId.value = null;
      albumDetail.value = null;
      loading.value = false;
      return;
    }

    void fetchAlbumDetail(albumId);
  },
  {
    immediate: true,
  }
);

watch(
  [albumDetail, albumRouteId],
  ([detail, albumId]) => {
    if (!detail?.photos?.length || !albumId) {
      currentPhoto.value = null;
      return;
    }

    currentPhoto.value = detail.photos[0];
    currentSlideIndexMobile.value = 0;
  },
  {
    immediate: true,
  }
);

const handleCloseModal = () => {
  isExpanded.value = false;
  showMobileExif.value = false;
  isMobilePhotoZoomed.value = false;
  void closeAlbumModal();
};

const fullscreenImage = ref();

const handleCloseViewer = () => {
  fullscreenImage.value = null;
};

const handleFullScreenClick = () => {
  fullscreenImage.value = document.getElementById(
    `image-id-${currentPhoto.value?.id}`
  );
};
</script>

<style scoped lang="less">
.album-modal {
  height: 100%;
  width: 100%;
  display: flex;

  .image-container {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #212121;
  }

  .info-container {
    flex-shrink: 0;
    width: 500px;
    height: 100%;
  }

  .album-modal-image {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}

@safe-area-bottom: env(safe-area-inset-bottom, 0px);

.album-modal-mobile {
  --mobile-info-panel-height: 0px;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #212121;
}

.mobile-photo-area {
  width: 100%;
  height: calc(100% - var(--mobile-info-panel-height));
  position: relative;
  transition: height 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  background: #212121;
  overflow: hidden;
}

.mobile-top-bar {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-top-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-top-location {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

.mobile-info-btn,
.mobile-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mobile-exif-overlay {
  position: absolute;
  inset: 0;
  z-index: 11;
}

.mobile-exif-popover {
  position: absolute;
  top: 58px;
  left: 14px;
  right: 14px;
}

.mobile-progress-bar {
  position: absolute;
  top: 48px;
  left: 14px;
  right: 14px;
  z-index: 10;
  display: flex;
  gap: 4px;
}

.mobile-progress-segment {
  flex: 1;
  height: 2px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.24);
  min-width: 6px;

  &.viewed {
    background: rgba(255, 255, 255, 0.72);
  }

  &.current {
    background: rgba(255, 255, 255, 0.72);
  }
}

.mobile-peek-strip {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  height: calc(60px + @safe-area-bottom);
  padding-bottom: @safe-area-bottom;
  background: rgba(245, 243, 240, 0.85);
  backdrop-filter: blur(24px) saturate(135%);
  -webkit-backdrop-filter: blur(24px) saturate(135%);
  border-top: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 -8px 32px rgba(28, 28, 28, 0.12);
  border-radius: 14px 14px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
  box-sizing: border-box;
}

.peek-handle {
  width: 28px;
  height: 3px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.12);
  margin-bottom: 8px;
  flex-shrink: 0;
  cursor: pointer;
}

.peek-content {
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.peek-title {
  font-size: 14px;
  font-weight: bold;
  color: #121315;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 12px;
}

.mobile-info-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  height: var(--mobile-info-panel-height);
  background: rgba(245, 243, 240, 0.85);
  backdrop-filter: blur(24px) saturate(135%);
  -webkit-backdrop-filter: blur(24px) saturate(135%);
  border-top: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 -8px 32px rgba(28, 28, 28, 0.12);
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  align-items: center;
  box-sizing: border-box;
}

.album-modal-mobile.mobile-info-expanded.mobile-photo-zoomed {
  .mobile-photo-area {
    overflow: visible;
  }
}

.mobile-info-scroll {
  width: 100%;
  flex-shrink: 0;
  position: relative;
  padding: 16px 24px 0;
  box-sizing: border-box;
}

.mobile-info-desc-scroll {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  padding: 0 24px calc(24px + @safe-area-bottom);
  box-sizing: border-box;
}

.mobile-stamp-full {
  position: absolute;
  top: 10px;
  right: 16px;
  opacity: 0.85;
  z-index: 0;
  pointer-events: none;
}

.mobile-info-title {
  position: relative;
  z-index: 1;
  padding-right: 72px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-thickness: 1px;
  margin-bottom: 16px;
  color: #121315;
}

.mobile-info-desc {
  font-size: 13px;
  line-height: 2.2;
  text-decoration: underline #999;
  text-underline-offset: 6px;
  color: #333;
}

.mobile-exif-fade-enter-active,
.mobile-exif-fade-leave-active {
  transition: opacity 0.18s ease;
}

.mobile-exif-fade-enter-from,
.mobile-exif-fade-leave-to {
  opacity: 0;
}

.info-slide-enter-active,
.info-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.info-slide-enter-from,
.info-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
