import { AxiosResponse } from 'axios';
import { TSafe } from '../typing';
import axiosInstance from './axiosInstance';

export const createSafeApi = async (name: string): Promise<TSafe> => {
  const response = await axiosInstance.post<TSafe, AxiosResponse<TSafe>, { name: string }>(
    'private/createSafe',
    { name }
  );
  return response.data;
};
