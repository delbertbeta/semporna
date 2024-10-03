<template>
  <modal @close="handleCloseModal" :visible="showAlbumModal" size="large">
    <div class="album-modal">
      <div class="image-container">
        <album-modal-toolbar />
        <album-modal-slider />
      </div>
      <div class="info-container">
        <album-modal-info />
      </div>
    </div>
  </modal>
</template>

<script setup lang="ts">
import { useAppStore } from '../store';
import { storeToRefs } from 'pinia';
import Modal from './modal.vue';
import AlbumModalToolbar from './album-modal-toolbar.vue';
import AlbumModalInfo from './album-modal-info.vue';
import AlbumModalSlider from './album-modal-slider.vue';

const store = useAppStore();
const { closeAlbumModal } = store;
const { showAlbumModal } = storeToRefs(store);

const handleCloseModal = () => {
  closeAlbumModal();
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
