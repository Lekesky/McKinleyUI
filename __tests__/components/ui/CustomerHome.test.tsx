import CustomerHome from '@/components/ui/CustomerHome';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('@/context/CartContext');
jest.mock('expo-router');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CustomerHome', () => {
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
    (useCart as jest.Mock).mockReturnValue({
      addItem: jest.fn(),
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockImplementation((url: string) => {
      if (url.includes('/user/')) {
        return Promise.resolve({ data: { firstName: 'John' } });
      }
      if (url.includes('/menu')) {
        return Promise.resolve({
          data: [
            {
              id: '1',
              name: 'Burger',
              description: 'Delicious burger',
              price: 10.99,
              tags: ['Lunch'],
            },
            {
              id: '2',
              name: 'Pancakes',
              description: 'Fluffy pancakes',
              price: 8.99,
              tags: ['Breakfast'],
            },
          ],
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('should render customer home screen', async () => {
    const { UNSAFE_root } = render(<CustomerHome />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalled();
    });
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should fetch menu items on mount', async () => {
    render(<CustomerHome />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/menu',
        expect.any(Object)
      );
    });
  });

  it('should display greeting with user name', async () => {
    const { getByText } = render(<CustomerHome />);

    await waitFor(() => {
      expect(getByText(/John/)).toBeTruthy();
    });
  });
});
