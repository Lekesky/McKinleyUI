import WaitressHome from '@/components/ui/WaitressHome';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { TableProvider } from '@/context/TableContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('@/context/CartContext');
jest.mock('expo-router');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WaitressHome', () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      uid: 'waitress-123',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    (useCart as jest.Mock).mockReturnValue({
      addItem: jest.fn(),
      getActiveCart: jest.fn(() => []),
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'Burger',
          description: 'Delicious burger',
          price: 10.99,
          tags: ['Lunch'],
        },
      ],
    });
  });

  it('should render waitress home screen', async () => {
    const { UNSAFE_root } = render(
      <TableProvider>
        <WaitressHome />
      </TableProvider>
    );

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalled();
    });
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should fetch menu items on mount', async () => {
    render(
      <TableProvider>
        <WaitressHome />
      </TableProvider>
    );

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/menu')
      );
    });
  });
});
