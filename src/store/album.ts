import { getAlbumMeta } from '@/request';
import { AlbumMeta } from '@/typings';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAlbumStore = defineStore('album', () => {
  const albums = ref<AlbumMeta[]>([]);
  const initialized = ref<boolean>(false);
  const error = ref<boolean>(false);

  const activeYear = ref<number | null>(null);
  const activeMonth = ref<number | null>(null);

  const initAlbums = async () => {
    try {
      const albumsRes = await getAlbumMeta();
      if (albumsRes.data.code !== 0) {
        throw new Error('Server error: ' + JSON.stringify(albumsRes.data));
      }
      albums.value = albumsRes.data.data.albums;
      initialized.value = true;
    } catch (e) {
      console.error(e);
      error.value = true;
    }
  };

  const setActiveDate = (year: number, month: number) => {
    activeYear.value = year;
    activeMonth.value = month;
  };

  return {
    albums,
    initialized,
    error,
    activeYear,
    activeMonth,

    initAlbums,
    setActiveDate,
  };
});
