import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { JWT_TOKEN } from '../Const';
import AuthUtil from '../utils/AuthUtil';

export const headerJson = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const headerFormData = {
  Accept: 'application/json',
  'Content-Type': 'multipart/form-data',
};

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_SERVER_URI,
  timeout: 1000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = await AuthUtil.getBearerToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  // range of 2xx
  (response) => {
    return response;
  },
  // out of the range of 2xx
  (error) => {
    return Promise.reject({ message: parseAxiosError(error) });
  },
);

const parseAxiosError = (error: AxiosError) => {
  console.log('parseAxiosError', error);

  if (error.code === AxiosError.ERR_NETWORK) {
    console.log(`Connection failure ${error.stack}`);
    return 'Connection failure';
  }
  if (error.code === AxiosError.ERR_CANCELED) {
    return 'Connection canceled';
  }

  if (error.response) {
    // out of the range of 2xx
    if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
      const msg = 'Unexpected server error';
      console.log(`ERROR: ${msg}, ${error.response.data}`);
      return msg;
    }

    return (error.response.data as any).message;
  }
  if (error.request) {
    return 'No response received from the server';
  }
  return error.message;
};
export default axiosInstance;
