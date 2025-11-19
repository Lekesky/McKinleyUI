import CustomerOrders from '@/components/ui/CustomerOrders';
import { useAuth } from '@/context/AuthContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CustomerOrders', () => {
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
      uid: 'customer-123',
      userRole: 'CUSTOMER',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({
      data: [
        {
          id: '1',
          tableNumber: 3,
          items: [{ id: '1', name: 'Pizza', quantity: 1 }],
          status: 'IN-PROGRESS',
          totalPrice: 15.99,
        },
      ],
    });
  });

  it('should render customer orders view', async () => {
    const { UNSAFE_root } = render(<CustomerOrders />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalled();
    });
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should fetch customer orders on mount', async () => {
    render(<CustomerOrders />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/orders')
      );
    });
  });
});
