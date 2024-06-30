import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const showAboutModal = ref(false);
  const showAlbumModal = ref(false);

  const openAboutModal = () => {
    showAboutModal.value = true;
  };

  const closeAboutModal = () => {
    showAboutModal.value = false;
  };

  const openAlbumModal = () => {
    showAlbumModal.value = true;
  };

  const closeAlbumModal = () => {
    showAlbumModal.value = false;
  };

  return {
    showAboutModal,
    openAboutModal,
    closeAboutModal,

    showAlbumModal,
    openAlbumModal,
    closeAlbumModal,
  };
});
