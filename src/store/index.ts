import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AlbumMeta } from '@/typings';

export const useAppStore = defineStore('app', () => {
  const showAlbumModal = ref(false);
  const currentAlbumItem = ref<AlbumMeta | null>(null);

  const openAlbumModal = (item: AlbumMeta) => {
    currentAlbumItem.value = item;
    showAlbumModal.value = true;
  };

  const closeAlbumModal = () => {
    showAlbumModal.value = false;
    currentAlbumItem.value = null;
  };

  const isAnyModalOpen = computed(() => showAlbumModal.value);

  return {
    isAnyModalOpen,

    showAlbumModal,
    openAlbumModal,
    closeAlbumModal,

    currentAlbumItem,
  };
});
