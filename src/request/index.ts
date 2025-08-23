import { BaseResponse, GetAlbumsMetaRes, GetSingleAlbumRes } from '@/typings';
import axios, { AxiosProgressEvent } from 'axios';

const instance = axios.create({
  baseURL: API_END_POINT,
});

// 相册相关 API
export const getAlbumMeta = () => {
  return instance.get<BaseResponse<GetAlbumsMetaRes>>('/api/v1/albums/meta');
};

export const getAlbumById = (albumId: string) => {
  return instance.get<BaseResponse<GetSingleAlbumRes>>(
    `/api/v1/albums/${albumId}`
  );
};
