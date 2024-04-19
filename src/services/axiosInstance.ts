import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { JWT_TOKEN } from '../Const';

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
    const token = await SecureStore.getItemAsync(JWT_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
