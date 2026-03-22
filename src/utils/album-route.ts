export const ALBUM_ROUTE_NAME = 'album';

export const buildAlbumRouteLocation = (albumId: string) => ({
  name: ALBUM_ROUTE_NAME,
  params: {
    albumId,
  },
});
