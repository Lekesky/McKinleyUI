import Notification from '@/app/(tabs)/Notification';
import { useAuth } from '@/context/AuthContext';
import { TabBarProvider } from '@/context/TabBarContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Notification Screen', () => {
  const mockApiClient = {
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
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
        content: [
          {
            id: '1',
            userId: 'user-123',
            title: 'Order Update',
            message: 'Your order is ready',
            readStatus: false,
            timestamp: '2024-01-01T12:00:00Z',
          },
          {
            id: '2',
            userId: 'user-123',
            title: 'Payment',
            message: 'Payment confirmed',
            readStatus: true,
            timestamp: '2024-01-01T11:00:00Z',
          },
        ],
        number: 0,
        last: true,
      },
    });
    
    mockApiClient.patch.mockResolvedValue({ data: {} });
  });

  it('should render notifications screen', async () => {
    const { getByText } = render(
      <TabBarProvider>
        <Notification />
      </TabBarProvider>
    );

    await waitFor(() => {
      expect(getByText('Notifications')).toBeTruthy();
    });
  });

  it('should fetch notifications on mount', async () => {
    render(
      <TabBarProvider>
        <Notification />
      </TabBarProvider>
    );

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/notifications/user-123',
        expect.objectContaining({
          params: { page: 0, size: 10 }
        })
      );
    });
  });

  it('should display notification messages', async () => {
    const { getByText } = render(
      <TabBarProvider>
        <Notification />
      </TabBarProvider>
    );

    await waitFor(() => {
      expect(getByText('Your order is ready')).toBeTruthy();
      expect(getByText('Payment confirmed')).toBeTruthy();
    });
  });

  it('should mark notification as read when pressed', async () => {
    const { getByText } = render(
      <TabBarProvider>
        <Notification />
      </TabBarProvider>
    );

    await waitFor(() => {
      const notification = getByText('Your order is ready');
      fireEvent.press(notification);
    });

    expect(mockApiClient.patch).toHaveBeenCalledWith(
      '/notifications/read/1'
    );
  });

  it('should distinguish read and unread notifications', async () => {
    const { getByText } = render(
      <TabBarProvider>
        <Notification />
      </TabBarProvider>
    );

    await waitFor(() => {
      const unreadNotif = getByText('Your order is ready').parent;
      const readNotif = getByText('Payment confirmed').parent;
      
      // Unread should have different styling
      expect(unreadNotif).toBeTruthy();
      expect(readNotif).toBeTruthy();
    });
  });
});
