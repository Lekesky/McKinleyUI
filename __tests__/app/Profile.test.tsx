import Profile from '@/app/(tabs)/Profile';
import { useAuth } from '@/context/AuthContext';
import { useMobileTabBar } from '@/context/TabBarContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('@/context/TabBarContext');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Profile Screen', () => {
  const mockLogout = jest.fn();
  const mockHideTabBar = jest.fn();
  const mockShowTabBar = jest.fn();
  const mockApiClient = {
    get: jest.fn(),
    delete: jest.fn(),
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
      logout: mockLogout,
    });
    (useMobileTabBar as jest.Mock).mockReturnValue({
      hideTabBar: mockHideTabBar,
      showTabBar: mockShowTabBar,
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        timeCreated: new Date('2024-01-01').toISOString(),
        signInMethod: 'EMAIL',
      },
    });
  });

  it('should render profile screen', async () => {
    const { getByText } = render(<Profile />);

    await waitFor(() => {
      expect(getByText('Edit Profile')).toBeTruthy();
      expect(getByText('Update Password')).toBeTruthy();
      expect(getByText('Order History')).toBeTruthy();
      expect(getByText('Logout')).toBeTruthy();
    });
  });

  it('should fetch user details on mount', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith('/user/user-123');
    });
  });

  it('should show logout dialog when logout button pressed', async () => {
    const { getByText } = render(<Profile />);

    await waitFor(() => {
      expect(getByText('Logout')).toBeTruthy();
    });

    fireEvent.press(getByText('Logout'));

    expect(mockHideTabBar).toHaveBeenCalled();
  });

  it('should show delete account dialog', async () => {
    const { getByText } = render(<Profile />);

    await waitFor(() => {
      expect(getByText('Delete Account')).toBeTruthy();
    });

    fireEvent.press(getByText('Delete Account'));

    expect(mockHideTabBar).toHaveBeenCalled();
  });

  it('should restore tab bar on unmount', () => {
    const { unmount } = render(<Profile />);
    
    unmount();

    expect(mockShowTabBar).toHaveBeenCalled();
  });
});
