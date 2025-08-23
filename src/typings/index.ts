// 图片相关类型
export interface ImageModel {
  id: string;
  objectPath: string;
  sha256: string;
  proxied: {
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
  exif: {
    manufacturer?: string;
    model?: string;
    dateTime?: string;
    exposureTime?: string;
    fNumber?: string;
    focalLength?: string;
    iso?: string;
    lens?: string;
    ev?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
  };
}

// 照片相关类型
export interface PhotoModel {
  id?: string;
  isPost: boolean;
  title: string;
  description: string;
  image?: ImageModel;
}

// 相册相关类型
export interface AlbumModel {
  id?: string;
  date: string;
  mainArea: string;
  subArea: string;
}

export type AlbumRes = AlbumModel & {
  photos: (PhotoModel & {
    image: ImageModel;
  })[];
};

export interface GetSingleAlbumRes {
  album: AlbumRes;
}

export type AlbumMeta = AlbumModel & {
  poster: Pick<ImageModel, 'objectPath' | 'proxied'>;
};

export interface GetAlbumsMetaRes {
  albums: AlbumMeta[];
}

export interface BaseResponse<T> {
  code: number;
  data: T;
}
