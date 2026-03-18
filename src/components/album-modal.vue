<template>
  <!-- 移动端 -->
  <mobile-modal-wrapper
    v-if="isMobile"
    :visible="showAlbumModal"
    :loading="loading"
  >
    <div class="album-modal-mobile">
      <!-- 照片 Swiper（始终全屏，cover 模式） -->
      <div
        class="mobile-photo-area"
        :class="{ expanded: isExpanded }"
      >
        <album-modal-slider
          :album="albumDetail"
          :cover="true"
          @slideChange="handleSlideChange"
          @image-loading-state="handleImageLoadingState"
        />

        <!-- 顶部栏 -->
        <div class="mobile-top-bar">
          <span class="mobile-top-location">
            {{ albumDetail?.mainArea }}
            <template v-if="currentPhoto?.image.exif.dateTime">
              · {{ new Date(currentPhoto.image.exif.dateTime).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' }) }}
            </template>
          </span>
          <button class="mobile-close-btn" @click="handleCloseModal">
            <XMarkIcon class="size-4" />
          </button>
        </div>

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

        <!-- 展开状态下的 ⓘ 按钮（浮于照片右上角） -->
        <Popover v-if="isExpanded" class="mobile-exif-popover-wrapper">
          <PopoverButton class="outline-none">
            <div class="mobile-exif-btn">
              <ExclamationCircleIcon class="size-4" />
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
            <PopoverPanel class="mobile-exif-panel">
              <div class="rounded-md bg-white w-full overflow-hidden">
                <div class="text-text-main bg-green-transparent-1 h-7 px-3 font-bold w-full leading-7">
                  {{ currentPhoto?.image.exif.dateTime ? new Date(currentPhoto.image.exif.dateTime).toLocaleString() : '未知拍摄时间' }}
                </div>
                <div class="flex flex-row items-start py-2 px-3">
                  <ViewfinderCircleIcon class="size-4 mt-0.5" />
                  <div class="flex flex-col font-medium ms-2 text-sm">
                    <div>{{ currentPhoto?.image.exif.model || '未知相机' }}</div>
                    <div>{{ currentPhoto?.image.exif.lens || '未知镜头' }}</div>
                  </div>
                </div>
                <div class="bg-divider h-px mx-3" />
                <div class="flex font-medium mt-1 mb-2 mx-3 text-sm gap-2">
                  <span>{{ currentPhoto?.image.exif.fNumber || 'ƒ -' }}</span>
                  <span>{{ currentPhoto?.image.exif.focalLength || '- mm' }}</span>
                  <span>{{ currentPhoto?.image.exif.iso || 'ISO -' }}</span>
                  <span>{{ currentPhoto?.image.exif.ev || '- ev' }}</span>
                  <span>{{ currentPhoto?.image.exif.exposureTime || '- s' }}</span>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
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
          <Popover class="peek-exif-wrapper">
            <PopoverButton class="outline-none">
              <div class="mobile-exif-btn peek-exif-btn">
                <ExclamationCircleIcon class="size-4" />
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
              <PopoverPanel class="mobile-exif-panel">
                <div class="rounded-md bg-white w-full overflow-hidden">
                  <div class="text-text-main bg-green-transparent-1 h-7 px-3 font-bold w-full leading-7">
                    {{ currentPhoto?.image.exif.dateTime ? new Date(currentPhoto.image.exif.dateTime).toLocaleString() : '未知拍摄时间' }}
                  </div>
                  <div class="flex flex-row items-start py-2 px-3">
                    <ViewfinderCircleIcon class="size-4 mt-0.5" />
                    <div class="flex flex-col font-medium ms-2 text-sm">
                      <div>{{ currentPhoto?.image.exif.model || '未知相机' }}</div>
                      <div>{{ currentPhoto?.image.exif.lens || '未知镜头' }}</div>
                    </div>
                  </div>
                  <div class="bg-divider h-px mx-3" />
                  <div class="flex font-medium mt-1 mb-2 mx-3 text-sm gap-2">
                    <span>{{ currentPhoto?.image.exif.fNumber || 'ƒ -' }}</span>
                    <span>{{ currentPhoto?.image.exif.focalLength || '- mm' }}</span>
                    <span>{{ currentPhoto?.image.exif.iso || 'ISO -' }}</span>
                    <span>{{ currentPhoto?.image.exif.ev || '- ev' }}</span>
                    <span>{{ currentPhoto?.image.exif.exposureTime || '- s' }}</span>
                  </div>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>
        </div>
      </div>

      <!-- 展开状态：信息面板 -->
      <transition name="info-slide">
        <div
          v-if="isExpanded"
          ref="infoPanelRef"
          class="mobile-info-panel"
        >
          <div class="peek-handle" @click="isExpanded = false" />
          <div class="mobile-info-scroll">
            <div class="mobile-stamp-row">
              <div class="mobile-stamp-circle" />
              <div class="mobile-stamp-text">
                <div class="mobile-stamp-from">From:</div>
                <div class="mobile-stamp-city">{{ albumDetail?.mainArea }}</div>
                <div class="mobile-stamp-sub">{{ albumDetail?.subArea }}</div>
              </div>
            </div>
            <div class="mobile-info-title">{{ currentPhoto?.title }}</div>
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
import { storeToRefs } from 'pinia';
import Modal from './modal.vue';
import AlbumModalToolbar from './album-modal-toolbar.vue';
import AlbumModalInfo from './album-modal-info.vue';
import AlbumModalSlider from './album-modal-slider.vue';
import fullScreenViewer from './full-screen-viewer.vue';
import { ref, watch, watchEffect } from 'vue';
import { getAlbumById } from '@/request';
import { AlbumRes } from '@/typings';
import { useScrollOffset } from '@/composables/useScrollOffset';
import { useSwipe } from '@vueuse/core';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { ExclamationCircleIcon, ViewfinderCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import MobileModalWrapper from './mobile-modal-wrapper.vue';

const store = useAppStore();
const { closeAlbumModal } = store;
const { showAlbumModal, currentAlbumItem } = storeToRefs(store);

const { isMobile } = useScrollOffset();

const albumCache = new Map();
const loading = ref(false);
const albumDetail = ref<AlbumRes | null>(null);
const currentPhoto = ref<AlbumRes['photos'][0] | null>(null);
const isImageLoading = ref(true);

// 移动端展开状态
const isExpanded = ref(false);
const currentSlideIndexMobile = ref(0);

// peek 栏 / info panel 的 swipe ref
const peekRef = ref<HTMLElement | null>(null);
const infoPanelRef = ref<HTMLElement | null>(null);

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
  const idx = albumDetail.value?.photos?.findIndex(p => p.id === photo.id);
  if (idx !== undefined && idx >= 0) {
    currentSlideIndexMobile.value = idx;
  }
};

const fetchAlbumDetail = async (id: string) => {
  if (albumCache.has(id)) {
    loading.value = false;
    const res = albumCache.get(id);
    albumDetail.value = res;
  }

  loading.value = true;
  try {
    const res = await getAlbumById(id);
    if (res.data.data.album) {
      albumCache.set(id, res.data.data.album);
      albumDetail.value = res.data.data.album;
    }
  } catch (error) {
    console.error('Failed to fetch album detail:', error);
  } finally {
    loading.value = false;
  }
};

// 监听 currentAlbumItem 变化，自动加载数据
watchEffect(() => {
  if (currentAlbumItem.value?.id) {
    fetchAlbumDetail(currentAlbumItem.value.id);
    currentSlideIndexMobile.value = 0;
    isExpanded.value = false;
  }
});

// 数据加载完成后初始化 currentPhoto（避免首次打开 peek 栏为空）
watch(albumDetail, (detail) => {
  if (detail?.photos?.length && !currentPhoto.value) {
    currentPhoto.value = detail.photos[0];
  }
});

const handleCloseModal = () => {
  isExpanded.value = false;
  closeAlbumModal();
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
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-photo-area {
  flex-grow: 1;
  position: relative;
  transition: flex-basis 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  background: #212121;

  &.expanded {
    flex-grow: 0;
    flex-basis: max(200px, 28vh);
    flex-shrink: 0;
  }
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

.mobile-top-location {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

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
    background: rgba(255, 255, 255, 1);
  }

  &.current {
    background: rgba(255, 255, 255, 0.65);
  }
}

.mobile-exif-popover-wrapper {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
}

.mobile-exif-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mobile-exif-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: min(320px, 90vw);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 20;
}

.mobile-peek-strip {
  flex-shrink: 0;
  height: calc(60px + @safe-area-bottom);
  padding-bottom: @safe-area-bottom;
  background: rgba(245, 243, 240, 0.95);
  backdrop-filter: blur(16px);
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
  justify-content: space-between;
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

.peek-exif-wrapper {
  position: relative;
  flex-shrink: 0;
}

.peek-exif-btn {
  background: rgba(0, 0, 0, 0.07);
  color: #121315;
}

.mobile-info-panel {
  flex-shrink: 0;
  flex-grow: 1;
  background: rgba(245, 243, 240, 0.98);
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  align-items: center;
}

.mobile-info-scroll {
  width: 100%;
  overflow-y: auto;
  padding: 16px 24px calc(24px + @safe-area-bottom);
  box-sizing: border-box;
}

.mobile-stamp-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.mobile-stamp-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #c0392b;
  flex-shrink: 0;
}

.mobile-stamp-from {
  font-size: 12px;
  color: #618a54;
  font-weight: bold;
}

.mobile-stamp-city {
  font-size: 14px;
  font-weight: bold;
  color: #2b4e20;
  margin-top: 2px;
}

.mobile-stamp-sub {
  font-size: 13px;
  font-weight: bold;
  color: #2b4e20;
  margin-top: 2px;
}

.mobile-info-title {
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

.info-slide-enter-active,
.info-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.info-slide-enter-from,
.info-slide-leave-to {
  transform: translateY(100%);
}
</style>
