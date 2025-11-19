import UserProfile from '@/app/UserProfile';
import { useAuth } from '@/context/AuthContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('expo-router');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserProfile Screen', () => {
  const mockApiClient = {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      uid: 'user-123',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
      },
    });
  });

  it('should render user profile screen', async () => {
    const { UNSAFE_root } = render(<UserProfile />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalled();
    });
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should fetch user profile data on mount', async () => {
    render(<UserProfile />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/user/')
      );
    });
  });
});
