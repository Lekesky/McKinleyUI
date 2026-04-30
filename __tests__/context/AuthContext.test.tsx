import { AuthProvider, useAuth } from '@/context/AuthContext';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth0 } from 'react-native-auth0';
import axios from 'axios';

jest.mock('react-native-auth0', () => ({
  useAuth0: jest.fn(),
}));
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUseAuth0 = useAuth0 as jest.Mock;

describe('AuthContext', () => {
  const post = jest.fn();
  const get = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuth0.mockReturnValue({
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        idToken: 'id-token',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
        tokenType: 'Bearer',
      }),
      isLoading: false,
      user: null,
    });

    post.mockResolvedValue({
      data: {
        uid: 'user-123',
      },
    });

    get.mockResolvedValue({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '555-0100',
        userRole: 'CUSTOMER',
      },
    });

    mockedAxios.create = jest.fn(() => ({
      get,
      post,
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })) as any;
  });

  it('should throw error when useAuth is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleError.mockRestore();
  });

  it('should initialize with null values when there is no authenticated user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.uid).toBeNull();
    expect(result.current.userRole).toBeNull();
  });

  it('should sync the authenticated user into the app profile', async () => {
    mockedUseAuth0.mockReturnValue({
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        idToken: 'id-token',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
        tokenType: 'Bearer',
      }),
      isLoading: false,
      user: { sub: 'auth0|user-123' },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith('/user/login', { userId: 'auth0|user-123' });
    });

    await waitFor(() => {
      expect(result.current.uid).toBe('user-123');
      expect(result.current.userRole).toBe('CUSTOMER');
    });
  });

  it('should return true when a profile is complete', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await expect(result.current.checkProfileComplete('user-123')).resolves.toBe(true);
    expect(get).toHaveBeenCalledWith('/user/user-123');
  });

  it('should return false when profile lookup fails', async () => {
    get.mockRejectedValueOnce(new Error('network error'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await expect(result.current.checkProfileComplete('user-123')).resolves.toBe(false);
  });
});
