

import axios, { AxiosInstance } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://confirmed-receptor-inkjet-pee.trycloudflare.com/api";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

export default function createAPIClient(): AxiosInstance {
  const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  });

  // Request interceptor - Add token to headers if exists/Up-to-date
  apiClient.interceptors.request.use(
    async (config) => {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        
      }
      return config;
    }, 
    (error) => { return Promise.reject(error) }
  );

  // Response interceptor - Handle 403 errors
  apiClient.interceptors.response.use(
    (response) => { return response },
    async (error) => { 
      const originalRequest = error.config;
      
      // If 401/403 and not already retrying
      if ((error.response?.status === 401 || error.response?.status === 403) && 
          !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Get stored refresh token
          const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
          if (!refreshToken) throw new Error('No refresh token available');
          
          // Attempt to refresh the token
          const response = await axios.post(`${API_URL}/user/refresh-token`, { 
            refreshToken 
          });
          
          // Save new tokens
          await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.data.accessToken);
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Force logout on refresh failure
          await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
          await SecureStore.deleteItemAsync('uid');
          
          // Navigate to login
          router.replace('/Intro');
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return apiClient;
}