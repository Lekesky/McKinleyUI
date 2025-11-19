import AdminMenu from '@/components/ui/AdminMenu';
import { useAuth } from '@/context/AuthContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('expo-router');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AdminMenu', () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
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
      data: [
        { id: '1', name: 'Burger', price: 10.99, description: 'Tasty burger' },
        { id: '2', name: 'Fries', price: 3.99, description: 'Crispy fries' },
      ],
    });
  });

  it('should render admin menu management', async () => {
    const { UNSAFE_root } = render(<AdminMenu />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalled();
    });
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should fetch menu items on mount', async () => {
    render(<AdminMenu />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/menu')
      );
    });
  });
});
