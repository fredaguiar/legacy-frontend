import { AxiosResponse } from 'axios';
import axiosInstance, { headerJson } from './axiosInstance';

export const saveTextTitleApi = async (title: string): Promise<boolean> => {
  const response = await axiosInstance.post<TSafe, AxiosResponse<boolean>, { title: string }>(
    'private/saveTextTitle',
    { title },
    { headers: headerJson },
  );
  return response.data;
};
