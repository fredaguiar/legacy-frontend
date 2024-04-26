import { AxiosResponse } from 'axios';
import RNFS from 'react-native-fs';
import {
  TDownloadFiles,
  TFileInfoList,
  TFileInfoListResult,
  TUploadFiles,
  TUploadFilesResult,
} from '../typing';
import axiosInstance, { headerFormData, headerJson } from './axiosInstance';
import AuthUtil from '../utils/AuthUtil';

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
  const response = await axiosInstance.get<
    TFileInfoList,
    AxiosResponse<TFileInfoListResult>,
    TFileInfoList
  >(`private/fileInfoList/${safeId}`, { headers: headerJson });

  console.log('getFileInfoListApi', response.data);
  return response.data;
};

export const downloadFilesApi = async ({ safeId, fileId }: TDownloadFiles): Promise<string> => {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_SERVER_URI}/private/downloadFiles/${safeId}/${fileId}`;
    const localFilePath = `${RNFS.DownloadDirectoryPath}/LEGACY`;
    const bearerToken = await AuthUtil.getBearerToken();

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: localFilePath,
      background: true,
      headers: { Authorization: bearerToken },
      begin: (res) => {
        console.log('Download has begun with jobId: ', res.jobId);
      },
      progress: (res) => {
        let progressPercent = (res.bytesWritten / res.contentLength) * 100;
        console.log('Download Progress: ', progressPercent.toFixed(2) + '%');
      },
    }).promise;

    console.log('File downloaded result:', result);
    if (result.statusCode !== 200) {
      throw new Error('File could not be open');
    }

    console.log('File downloaded to:', localFilePath);
    return localFilePath; // You can use this path to access the file later
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
