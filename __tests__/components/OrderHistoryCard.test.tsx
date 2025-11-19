import OrderHistoryCard from '@/components/OrderHistoryCard';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('OrderHistoryCard', () => {
  const mockOrder = {
    id: '123456',
    customerFirstName: 'John',
    customerLastName: 'Doe',
    waitressFirstName: 'Jane',
    waitressLastName: 'Smith',
    tableNumber: 5,
    orderedItems: [
      { id: '1', name: 'Burger', quantity: 2, price: 10.99 },
      { id: '2', name: 'Fries', quantity: 1, price: 3.99 },
    ],
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    totalPrice: 25.97,
    orderStartTime: '2024-01-01T12:00:00Z',
    orderEndTime: '2024-01-01T13:00:00Z',
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render order history details', () => {
    const { getByText } = render(
      <OrderHistoryCard {...mockOrder} onPress={mockOnPress} />
    );

    expect(getByText(/Order #/)).toBeTruthy();
    expect(getByText(/\$25\.97/)).toBeTruthy();
    expect(getByText(/COMPLETED/)).toBeTruthy();
    expect(getByText(/PAID/)).toBeTruthy();
  });

  it('should call onPress when card is pressed', () => {
    const { getByText } = render(
      <OrderHistoryCard {...mockOrder} onPress={mockOnPress} />
    );

    const orderElement = getByText(/Order #/).parent?.parent;
    if (orderElement) {
      fireEvent.press(orderElement);
      expect(mockOnPress).toHaveBeenCalled();
    }
  });

  it('should display customer and waitress names', () => {
    const { getByText } = render(
      <OrderHistoryCard {...mockOrder} onPress={mockOnPress} />
    );

    expect(getByText(/John Doe/)).toBeTruthy();
    expect(getByText(/Jane Smith/)).toBeTruthy();
  });

  it('should show table number', () => {
    const { getByText } = render(
      <OrderHistoryCard {...mockOrder} onPress={mockOnPress} />
    );

    expect(getByText(/Table 5/)).toBeTruthy();
  });
});
