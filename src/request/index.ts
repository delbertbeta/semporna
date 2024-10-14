import { BaseResponse, GetAlbumsMetaRes } from '@/typings';
import axios from 'axios';

const instance = axios.create({
  baseURL: API_END_POINT,
});

export const getAlbumMeta = () => {
  return instance.get<BaseResponse<GetAlbumsMetaRes>>('/api/v1/albums/meta');
};
