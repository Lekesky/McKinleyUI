import { AuthProvider, useAuth } from '@/context/AuthContext';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
  });

  it('should throw error when useAuth is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleError.mockRestore();
  });

  it('should initialize with null values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.uid).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.userRole).toBeNull();
  });

  it('should login with tokens and store them', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const refreshToken = 'refresh-token-123';
    const uid = 'user-123';

    await act(async () => {
      await result.current.loginTokens(accessToken, refreshToken, uid);
    });

    expect(result.current.uid).toBe(uid);
    expect(result.current.accessToken).toBe(accessToken);
    expect(result.current.refreshToken).toBe(refreshToken);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('access_token', accessToken);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refresh_token', refreshToken);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('uid', uid);
  });

  it('should logout and clear tokens', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // First login
    await act(async () => {
      await result.current.loginTokens('access', 'refresh', 'uid-123');
    });

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.uid).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('access_token');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refresh_token');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('uid');
  });

  it('should load tokens from storage on mount', async () => {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const refreshToken = 'refresh-token';
    const uid = 'user-456';

    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
      if (key === 'access_token') return Promise.resolve(accessToken);
      if (key === 'refresh_token') return Promise.resolve(refreshToken);
      if (key === 'uid') return Promise.resolve(uid);
      return Promise.resolve(null);
    });

    mockedAxios.create = jest.fn(() => ({
      ...mockedAxios,
      get: jest.fn().mockResolvedValue({ data: 'CUSTOMER' }),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })) as any;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.uid).toBe(uid);
    });

    expect(result.current.accessToken).toBe(accessToken);
    expect(result.current.refreshToken).toBe(refreshToken);
  });

  it('should refresh access token', async () => {
    const newAccessToken = 'new-access-token';
    const newRefreshToken = 'new-refresh-token';

    mockedAxios.create = jest.fn(() => ({
      ...mockedAxios,
      post: jest.fn().mockResolvedValue({
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      }),
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })) as any;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Set initial refresh token
    await act(async () => {
      await result.current.loginTokens('old-access', 'old-refresh', 'uid-123');
    });

    // Refresh the token
    await act(async () => {
      await result.current.refreshAccessToken();
    });

    await waitFor(() => {
      expect(result.current.accessToken).toBe(newAccessToken);
    });

    expect(result.current.refreshToken).toBe(newRefreshToken);
  });
});
