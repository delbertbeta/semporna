<template>
  <modal
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
import { ref, watchEffect } from 'vue';
import { getAlbumById } from '@/request';
import { AlbumRes } from '@/typings';

const store = useAppStore();
const { closeAlbumModal } = store;
const { showAlbumModal, currentAlbumItem } = storeToRefs(store);

const albumCache = new Map();
const loading = ref(false);
const albumDetail = ref<AlbumRes | null>(null);
const currentPhoto = ref<AlbumRes['photos'][0] | null>(null);
const isImageLoading = ref(true);

const handleImageLoadingState = (loading: boolean) => {
  isImageLoading.value = loading;
};

const handleSlideChange = (photo: AlbumRes['photos'][0]) => {
  currentPhoto.value = photo;
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
  }
});

const handleCloseModal = () => {
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
</style>
