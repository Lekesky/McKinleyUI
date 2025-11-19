import AdminAnalytics from '@/components/ui/AdminAnalytics';
import { useAuth } from '@/context/AuthContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AdminAnalytics', () => {
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
      uid: 'admin-123',
      userRole: 'ADMIN',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({
      data: {
        totalOrders: 150,
        totalRevenue: 5000.00,
        activeUsers: 45,
        pendingOrders: 12,
      },
    });
  });

  it('should render analytics dashboard', async () => {
    const { UNSAFE_root } = render(<AdminAnalytics />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalled();
    });
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should fetch analytics data on mount', async () => {
    render(<AdminAnalytics />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/analytics')
      );
    });
  });
});
