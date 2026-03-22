import { defineStore } from 'pinia';
import { computed } from 'vue';
import { AlbumMeta } from '@/typings';
import router from '@/router';
import {
  ALBUM_ROUTE_NAME,
  buildAlbumRouteLocation,
} from '@/utils/album-route';

export const useAppStore = defineStore('app', () => {
  const openAlbumModal = async (item: AlbumMeta) => {
    if (!item.id) {
      return;
    }

    await router.push(buildAlbumRouteLocation(item.id));
  };

  const closeAlbumModal = async () => {
    const isAlbumRoute = router.currentRoute.value.name === ALBUM_ROUTE_NAME;
    const canGoBackInApp = Boolean(window.history.state?.back);

    if (isAlbumRoute && canGoBackInApp) {
      await router.back();
      return;
    }

    await router.push({ name: 'home' });
  };

  const isAnyModalOpen = computed(() => (
    router.currentRoute.value.name === ALBUM_ROUTE_NAME
  ));

  return {
    isAnyModalOpen,
    openAlbumModal,
    closeAlbumModal,
  };
});
