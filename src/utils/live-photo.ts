type LivePhotoLike = {
  id?: string | number;
  image?: {
    livePhoto?: {
      videoPath?: string;
    };
  };
} | null | undefined;

export const hasLivePhoto = (photo: LivePhotoLike) => {
  return Boolean(photo?.image?.livePhoto?.videoPath);
};

export const canAutoplayLivePhoto = (
  photo: LivePhotoLike,
  autoplayEnabled: boolean
) => {
  return autoplayEnabled && hasLivePhoto(photo);
};

export const getLivePhotoReplayKey = (
  photoId: string | number | undefined,
  playSignal: number
) => {
  return `live-photo-${photoId ?? 'unknown'}-${playSignal}`;
};
