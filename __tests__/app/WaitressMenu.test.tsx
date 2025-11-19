import WaitressMenu from '@/app/WaitressMenu';
import { useAuth } from '@/context/AuthContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('@/context/CartContext');
jest.mock('expo-router');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WaitressMenu Screen', () => {
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
      uid: 'user-123',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({
      data: [
        { id: '1', name: 'Burger', price: 10.99, description: 'Tasty' },
        { id: '2', name: 'Fries', price: 3.99, description: 'Crispy' },
      ],
    });
  });

  it('should render waitress menu screen', async () => {
    const { getByText } = render(<WaitressMenu />);

    await waitFor(() => {
      expect(getByText('Menu')).toBeTruthy();
    });
  });

  it('should fetch menu items on mount', async () => {
    render(<WaitressMenu />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/menu')
      );
    });
  });

  it('should display menu items', async () => {
    const { getByText } = render(<WaitressMenu />);

    await waitFor(() => {
      expect(getByText('Burger')).toBeTruthy();
      expect(getByText('Fries')).toBeTruthy();
    });
  });
});
