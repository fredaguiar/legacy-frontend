import { AxiosResponse } from 'axios';
import RNFS from 'react-native-fs';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import FileViewer from 'react-native-file-viewer';
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

export const downloadFilesApi = async ({
  safeId,
  fileId,
  filename,
}: TDownloadFiles): Promise<string> => {
  try {
    const granted = await requestStoragePermission();
    if (!granted) {
      console.error('File storage not granted:');
      throw new Error('File storage not granted');
    }

    const url = `${process.env.EXPO_PUBLIC_API_SERVER_URI}/private/downloadFiles/${safeId}/${fileId}`;
    const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    // const localFilePath = '/data/data/com.fredaguiar.legacyfrontend/files/Toyota-Corolla.png';
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

    if (result.statusCode !== 200) {
      throw new Error('File could not be downloaded');
    }

    try {
      console.log('File downloaded to:', localFilePath);
      console.log('FileViewer --------------------', FileViewer);
      await FileViewer.open(localFilePath);
    } catch (error: any) {
      console.error('File could not be open:', error);
      throw new Error('File could not be open');
    }

    return localFilePath;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

const requestStoragePermission = async () => {
  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (hasPermission) {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs Storage Permission to download files',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    console.log('hasPermission', hasPermission);
    console.log('PermissionsAndroid.RESULTS:', granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    console.log('NOT ALLOWED');
    Alert.alert(
      'Permission Required',
      'You need to enable storage permission to use this feature. Please enable it in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => {} },
      ],
    );
  } catch (err) {
    console.warn(err);
  }
};
