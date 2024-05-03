import { AxiosResponse } from 'axios';
import axiosInstance, { headerFormData, headerJson } from './axiosInstance';

export const createSafeApi = async (name: string): Promise<TSafe> => {
  const response = await axiosInstance.post<TSafe, AxiosResponse<TSafe>, { name: string }>(
    'private/createSafe',
    { name },
    { headers: headerJson },
  );
  return response.data;
};
