import KitchenOrders from '@/components/ui/KitchenOrders';
import { useAuth } from '@/context/AuthContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('KitchenOrders', () => {
  const mockApiClient = {
    get: jest.fn(),
    put: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      uid: 'chef-123',
      userRole: 'CHEF',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({
      data: [
        {
          id: '1',
          tableNumber: 5,
          items: [{ id: '1', name: 'Burger', quantity: 2 }],
          status: 'PENDING',
        },
      ],
    });
  });

  it('should render kitchen orders view', async () => {
    const { UNSAFE_root } = render(<KitchenOrders />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalled();
    });
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should fetch orders on mount', async () => {
    render(<KitchenOrders />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/orders')
      );
    });
  });
});
