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

  const mobileDrawerOpen = ref(false);

  const toggleMobileDrawer = () => {
    mobileDrawerOpen.value = !mobileDrawerOpen.value;
  };

  const closeMobileDrawer = () => {
    mobileDrawerOpen.value = false;
  };

  return {
    isAnyModalOpen,

    showAlbumModal,
    openAlbumModal,
    closeAlbumModal,

    currentAlbumItem,

    mobileDrawerOpen,
    toggleMobileDrawer,
    closeMobileDrawer,
  };
});
