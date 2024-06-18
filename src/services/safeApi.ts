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

export const updateSafeApi = async ({
  fieldToUpdate,
  name,
  _id,
  description,
  autoSharing,
  emails,
  phones,
}: TSafeUpdate): Promise<TSafeUpdate> => {
  const response = await axiosInstance.post<TSafeUpdate, AxiosResponse<TSafe>, TSafeUpdate>(
    'private/updateSafe',
    { fieldToUpdate, name, _id, description, autoSharing, emails, phones },
    { headers: headerJson },
  );
  return { ...response.data, fieldToUpdate };
};

export const updateContactsApi = async ({
  contactType,
  safeId,
  contactList,
  deleteContactList,
}: TContactUpdate): Promise<boolean> => {
  const response = await axiosInstance.post<TContactUpdate, AxiosResponse<boolean>, TContactUpdate>(
    'private/updateContacts',
    { contactType, safeId, contactList, deleteContactList },
    { headers: headerJson },
  );
  return response.data;
};

export const deleteSafeListApi = async ({ safeIdList }: TSafeIdList): Promise<TSafeIdList> => {
  const response = await axiosInstance.post<TSafeIdList, AxiosResponse<TSafeIdList>, TSafeIdList>(
    'private/deleteSafeList',
    { safeIdList },
    { headers: headerJson },
  );
  return response.data;
};

export const saveTextTitleApi = async ({
  title,
  safeId,
  fileName,
}: TTextTitle): Promise<boolean> => {
  const response = await axiosInstance.post<TTextTitle, AxiosResponse<boolean>, TTextTitle>(
    'private/saveTextTitle',
    { title, safeId, fileName },
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
  fileName,
}: TPassword): Promise<boolean> => {
  console.log('SAVE PASS', title, username, password, notes, safeId, fileName);
  const response = await axiosInstance.post<TPassword, AxiosResponse<boolean>, TPassword>(
    'private/savePassword',
    { title, username, password, notes, safeId, fileName },
    { headers: headerJson },
  );
  return response.data;
};

export const getSafeApi = async ({ safeId }: TGetSafe): Promise<TSafe> => {
  // console.log('-------------------------------------');
  console.log('getSafeApi', safeId);
  const response = await axiosInstance.get<TGetSafe, AxiosResponse<TSafe>, TGetSafe>(
    `private/getSafe/${safeId}`,
    { headers: headerJson },
  );
  return response.data;
};

export const getPasswordApi = async ({ fileName, safeId }: TGetPassword): Promise<TPassword> => {
  console.log('getPasswordApi', fileName, safeId);
  const response = await axiosInstance.get<TGetPassword, AxiosResponse<TPassword>, TGetPassword>(
    `private/getPassword/${safeId}/${fileName}`,
    { headers: headerJson },
  );
  return response.data;
};
