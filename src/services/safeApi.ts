import { AxiosResponse } from 'axios';
import {
  TDownloadFiles,
  TDownloadFilesResult,
  TFileInfoList,
  TFileInfoListResult,
  TSafe,
  TUploadFiles,
  TUploadFilesResult,
} from '../typing';
import axiosInstance, { headerFormData, headerJson } from './axiosInstance';

export const createSafeApi = async (name: string): Promise<TSafe> => {
  const response = await axiosInstance.post<TSafe, AxiosResponse<TSafe>, { name: string }>(
    'private/createSafe',
    { name },
    { headers: headerJson },
  );
  return response.data;
};

export const uploadFilesApi = async ({
  name,
  type,
  uri,
  safeId,
}: TUploadFiles): Promise<TUploadFilesResult> => {
  const formData = new FormData();

  console.log('SAFEID: ', safeId);
  formData.append('file', { uri, name, type } as any);
  formData.append('safeId', safeId);

  const response = await axiosInstance.post<FormData, AxiosResponse<TUploadFilesResult>, FormData>(
    'private/uploadFiles',
    formData,
    { headers: headerFormData },
  );
  return response.data;
};

export const getFileInfoListApi = async (safeId: string): Promise<TFileInfoListResult> => {
  // const response = await axiosInstance.get(`private/fileInfoList/{${safeId}}`, {
  //   headers: headerJson,
  // });

  const response = await axiosInstance.get<
    TFileInfoList,
    AxiosResponse<TFileInfoListResult>,
    TFileInfoList
  >(`private/fileInfoList/`, { headers: headerJson });

  console.log('getFileInfoListApi', response.data);
  return response.data;
};

export const downloadFilesApi = async ({ name }: TDownloadFiles): Promise<TDownloadFilesResult> => {
  const formData = new FormData();
  formData.append('file', { name } as any);

  const response = await axiosInstance.post<
    FormData,
    AxiosResponse<TDownloadFilesResult>,
    FormData
  >('private/downloadFiles', formData, { headers: headerFormData });

  console.log('downloadFilesApi', response.data);
  return response.data;
};
