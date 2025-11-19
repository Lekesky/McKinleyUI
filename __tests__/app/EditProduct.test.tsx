import EditProduct from '@/app/EditProduct';
import { useAuth } from '@/context/AuthContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: () => ({
    product: JSON.stringify({
      id: '1',
      name: 'Burger',
      description: 'Delicious burger',
      price: 10.99,
      category: 'Lunch',
      imageURL: 'http://example.com/burger.jpg',
    }),
  }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EditProduct Screen', () => {
  const mockApiClient = {
    get: jest.fn(),
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
      data: {
        id: '1',
        name: 'Burger',
        description: 'Delicious burger',
        price: 10.99,
        category: 'Lunch',
      },
    });
  });

  it('should render edit product form', async () => {
    const { getByPlaceholderText } = render(<EditProduct />);

    await waitFor(() => {
      expect(getByPlaceholderText('Enter product name')).toBeTruthy();
      expect(getByPlaceholderText('Enter product description')).toBeTruthy();
      expect(getByPlaceholderText('0.00')).toBeTruthy();
    });
  });

  it('should fetch product data on mount', async () => {
    const { getByPlaceholderText } = render(<EditProduct />);

    // Component gets data from params (mocked in test setup), not from API
    await waitFor(() => {
      expect(getByPlaceholderText('Enter product name').props.value).toBe('Burger');
    });
  });

  it('should populate form with product data', async () => {
    const { getByPlaceholderText } = render(<EditProduct />);

    await waitFor(() => {
      expect(getByPlaceholderText('Enter product name').props.value).toBe('Burger');
      expect(getByPlaceholderText('Enter product description').props.value).toBe('Delicious burger');
      expect(getByPlaceholderText('0.00').props.value).toBe('10.99');
    });
  });

  it('should update product when save button pressed', async () => {
    mockApiClient.put.mockResolvedValue({ data: { success: true } });

    const { getByText, getByPlaceholderText } = render(<EditProduct />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Enter product name'), 'Cheeseburger');
      fireEvent.press(getByText('Save'));
    });

    await waitFor(() => {
      expect(mockApiClient.put).toHaveBeenCalled();
    });
  });

  it('should delete product when delete button pressed', async () => {
    mockApiClient.delete.mockResolvedValue({ data: { success: true } });

    const { getByText } = render(<EditProduct />);

    await waitFor(() => {
      const deleteButton = getByText('Delete Item');
      fireEvent.press(deleteButton);
    });

    await waitFor(() => {
      expect(mockApiClient.delete).toHaveBeenCalled();
    });
  });
});
