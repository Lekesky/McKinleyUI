import axios, { AxiosInstance } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const API_URL = "https://influences-colours-cited-examining.trycloudflare.com/api";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Cookie helper for web
const getCookie = (name: string): string | null => {
  if (Platform.OS !== 'web') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
  if (Platform.OS !== 'web') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const deleteCookie = (name: string) => {
  if (Platform.OS !== 'web') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Storage abstraction
const getStoredItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return getCookie(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const setStoredItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    setCookie(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const deleteStoredItem = async (key: string) => {
  if (Platform.OS === 'web') {
    deleteCookie(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// Export storage utilities for use in other modules
export { deleteStoredItem, getStoredItem, setStoredItem };

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
      const accessToken = await getStoredItem(ACCESS_TOKEN_KEY);
    
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
          const refreshToken = await getStoredItem(REFRESH_TOKEN_KEY);
          if (!refreshToken) throw new Error('No refresh token available');
          
          // Attempt to refresh the token
          const response = await axios.post(`${API_URL}/user/refresh-token`, { 
            refreshToken 
          });
          
          // Save new tokens
          await setStoredItem(ACCESS_TOKEN_KEY, response.data.accessToken);
          await setStoredItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Force logout on refresh failure
          await deleteStoredItem(ACCESS_TOKEN_KEY);
          await deleteStoredItem(REFRESH_TOKEN_KEY);
          await deleteStoredItem('uid');
          
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