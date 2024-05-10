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

export const saveTextTitleApi = async ({ title, safeId, fileId }: TTextTitle): Promise<boolean> => {
  const response = await axiosInstance.post<TTextTitle, AxiosResponse<boolean>, TTextTitle>(
    'private/saveTextTitle',
    { title, safeId, fileId },
    { headers: headerJson },
  );
  return response.data;
};
