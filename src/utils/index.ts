import { ImageModel } from '@/typings';

export const imagePriority = ['480p', '720p', '1080p', 'origin'] as const;

export function getTargetImageUrl(
  qualityLevel: (typeof imagePriority)[number],
  imageModel: Pick<ImageModel, 'proxied' | 'objectPath'>
) {
  if (qualityLevel === 'origin') {
    return imageModel.objectPath;
  }
  return imageModel.proxied[qualityLevel];
}

export function matchImageUrl(
  imageModel: Pick<ImageModel, 'proxied' | 'objectPath'>,
  qualityOrder: 'lower' | 'higher',
  preferLevel: (typeof imagePriority)[number]
) {
  let index = imagePriority.indexOf(preferLevel);
  do {
    const url = getTargetImageUrl(imagePriority[index], imageModel);
    if (url) {
      return url;
    }
    if (qualityOrder === 'lower') {
      index--;
    } else {
      index++;
    }
  } while (index > 0 && index < imagePriority.length);

  return getTargetImageUrl('origin', imageModel);
}
