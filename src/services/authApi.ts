import axios, { AxiosResponse } from 'axios';
import { TCredentials, TSignUp, TUser } from '../typing';
import axiosInstance from './axiosInstance';

export const testApi = async (): Promise<void> => {
  console.log('Test API - 172.29.80.1');

  try {
    const response = await axiosInstance.get('test');
    console.log('response test', response.data);
  } catch (err: any) {
    console.log('Test API err test', err.stack);
  }
};

export const loginApi = async (credentials: TCredentials): Promise<TUser> => {
  const response = await axiosInstance.post<TUser, AxiosResponse<TUser>, TCredentials>(
    'login',
    credentials
  );
  console.log('axiosInstance login', response.data);
  return response.data;
};

export const signupApi = async (singup: TSignUp): Promise<TUser> => {
  const res = await axiosInstance.post<TUser>('/signup', {
    params: singup,
  });
  return res.data;
};
