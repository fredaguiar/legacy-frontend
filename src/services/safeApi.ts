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

export const savePasswordApi = async ({
  title,
  username,
  password,
  notes,
  safeId,
  fileId,
}: TPassword): Promise<boolean> => {
  console.log('SAVE PASS', title, username, password, notes, safeId, fileId);
  const response = await axiosInstance.post<TPassword, AxiosResponse<boolean>, TPassword>(
    'private/savePassword',
    { title, username, password, notes, safeId, fileId },
    { headers: headerJson },
  );
  return response.data;
};

export const getPasswordApi = async ({ fileId, safeId }: TGetPassword): Promise<TPassword> => {
  console.log('getPasswordApi', fileId, safeId);
  const response = await axiosInstance.get<TGetPassword, AxiosResponse<TPassword>, TGetPassword>(
    `private/getPassword/${safeId}/${fileId}`,
    { headers: headerJson },
  );
  return response.data;
};
