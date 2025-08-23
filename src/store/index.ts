import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AlbumMeta } from '@/typings';

export const useAppStore = defineStore('app', () => {
  const showAboutModal = ref(false);
  const showAlbumModal = ref(false);
  const currentAlbumItem = ref<AlbumMeta | null>(null);

  const openAboutModal = () => {
    showAboutModal.value = true;
  };

  const closeAboutModal = () => {
    showAboutModal.value = false;
  };

  const openAlbumModal = (item: AlbumMeta) => {
    currentAlbumItem.value = item;
    showAlbumModal.value = true;
  };

  const closeAlbumModal = () => {
    showAlbumModal.value = false;
    currentAlbumItem.value = null;
  };

  const isAnyModalOpen = computed(
    () => showAboutModal.value || showAlbumModal.value
  );

  return {
    showAboutModal,
    openAboutModal,
    closeAboutModal,
    isAnyModalOpen,

    showAlbumModal,
    openAlbumModal,
    closeAlbumModal,

    currentAlbumItem,
  };
});
