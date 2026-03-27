type SliderAlbumPhoto = {
  id?: number | string | null;
};

type SliderAlbum = {
  id?: number | string | null;
  photos?: SliderAlbumPhoto[] | null;
} | null;

export const getAlbumSliderKey = (album: SliderAlbum) => {
  if (!album?.id || !album.photos?.length) {
    return 'album-empty';
  }

  const photoIds = album.photos
    .map((photo) => photo.id ?? 'unknown')
    .join(',');

  return `album-${album.id}:${photoIds}`;
};
