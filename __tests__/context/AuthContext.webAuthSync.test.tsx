import { storeAuthRedirectAction } from '@/services/authRedirect';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { renderHook, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import axios from 'axios';

jest.mock('react-native-auth0', () => ({
  useAuth0: jest.fn(),
}));

jest.mock('axios');

const mockedUseAuth0 = useAuth0 as jest.Mock;
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createSessionStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    clear: jest.fn(() => {
      store = {};
    }),
    getItem: jest.fn((key: string) => store[key] ?? null),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
  };
};

describe('AuthContext web auth sync', () => {
  const originalPlatform = Platform.OS;
  const sessionStorageMock = createSessionStorageMock();
  const post = jest.fn();
  const get = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'web';

    (global as any).window = {
      sessionStorage: sessionStorageMock,
    };

    sessionStorageMock.clear();

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

    post.mockResolvedValue({
      data: {
        uid: 'app-user-123',
      },
    });

    get.mockResolvedValue({
      data: {
        firstName: 'Jamie',
        lastName: 'Lee',
        email: 'jamie@example.com',
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

  afterAll(() => {
    Platform.OS = originalPlatform;
  });

  it('posts to /user for a pending signup redirect', async () => {
    storeAuthRedirectAction('signup');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith('/user', { userId: 'auth0|user-123' });
    });

    expect(get).toHaveBeenCalledWith('/user/app-user-123');
    expect(result.current.uid).toBe('app-user-123');
  });

  it('defaults to /user/login when there is no pending signup redirect', async () => {
    renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith('/user/login', { userId: 'auth0|user-123' });
    });
  });
});
