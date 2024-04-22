import { AxiosResponse } from 'axios';
import { TSafe, TUploadFiles, TUploadFilesResult } from '../typing';
import axiosInstance, { headerFormData, headerJson } from './axiosInstance';

export const createSafeApi = async (name: string): Promise<TSafe> => {
  const response = await axiosInstance.post<TSafe, AxiosResponse<TSafe>, { name: string }>(
    'private/createSafe',
    { name },
    { headers: headerJson }
  );
  return response.data;
};

export const uploadFilesApi = async ({
  name,
  type,
  uri,
}: TUploadFiles): Promise<TUploadFilesResult> => {
  const formData = new FormData();
  formData.append('file', { uri, name, type } as any);

  const response = await axiosInstance.post<FormData, AxiosResponse<TUploadFilesResult>, FormData>(
    'private/uploadFiles',
    formData,
    { headers: headerFormData }
  );

  console.log('uploadFilesApi', response.data);
  return response.data;
};
