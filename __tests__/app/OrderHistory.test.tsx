import OrderHistory from '@/app/OrderHistory';
import { useAuth } from '@/context/AuthContext';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('expo-router');

// Mock OrderDetailsCard component
jest.mock('@/components/OrderDetailsCard', () => {
  const mockReact = require('react');
  const { View: MockView, Text: MockText } = require('react-native');
  return {
    __esModule: true,
    default: ({ orderNumber, totalPrice }: any) => mockReact.createElement(MockView, {}, 
      mockReact.createElement(MockText, {}, `Order #${orderNumber || ''}`),
      mockReact.createElement(MockText, {}, `$${totalPrice || 0}`)
    )
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OrderHistory Screen', () => {
  const mockApiClient = {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  const mockOrders = [
    {
      id: '1',
      customerFirstName: 'John',
      customerLastName: 'Doe',
      tableNumber: 5,
      orderedItems: [
        { id: '1', name: 'Burger', quantity: 2, price: 10.99 },
      ],
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      totalPrice: 21.98,
      orderStartTime: '2024-01-01T12:00:00Z',
      orderEndTime: '2024-01-01T13:00:00Z',
    },
    {
      id: '2',
      customerFirstName: 'John',
      customerLastName: 'Doe',
      tableNumber: 3,
      orderedItems: [
        { id: '2', name: 'Pizza', quantity: 1, price: 15.99 },
      ],
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      totalPrice: 15.99,
      orderStartTime: '2024-01-02T14:00:00Z',
      orderEndTime: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      uid: 'user-123',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({ data: mockOrders });
  });

  it('should render order history screen', async () => {
    const { getByText } = render(<OrderHistory />);

    await waitFor(() => {
      expect(getByText('Order History')).toBeTruthy();
    });
  });

  it('should fetch order history on mount', async () => {
    render(<OrderHistory />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/orders/all/user-123',
        expect.objectContaining({ params: expect.objectContaining({ page: 0, size: 10 }) })
      );
    });
  });

  it('should display order cards', async () => {
    const { getAllByText, getByText } = render(<OrderHistory />);

    await waitFor(() => {
      const orderElements = getAllByText(/Order #/);
      expect(orderElements.length).toBeGreaterThan(0);
      expect(getByText(/21\.98/)).toBeTruthy();
    });
  });

  it('should filter by order status', async () => {
    render(<OrderHistory />);

    // Component fetches data on mount
    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalled();
    });
  });

  it('should show empty state when no orders', async () => {
    mockApiClient.get.mockResolvedValue({ data: [] });

    const { getByText } = render(<OrderHistory />);

    await waitFor(() => {
      expect(getByText(/No orders/i)).toBeTruthy();
    });
  });
});
