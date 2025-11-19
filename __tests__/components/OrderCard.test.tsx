import OrderCard from '@/components/OrderCard';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('OrderCard', () => {
  const mockOrderProps = {
    id: '1',
    orderNumber: '1',
    orderedItems: [
      { id: '1', name: 'Burger', quantity: 2, price: 10.99 },
      { id: '2', name: 'Fries', quantity: 1, price: 3.99 },
    ],
    totalPrice: 25.97,
    status: 'pending',
    paymentStatus: 'PENDING',
    orderDate: '2024-01-01T12:00:00Z',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render order details correctly', () => {
    const { getByText } = render(
      <OrderCard {...mockOrderProps} />
    );

    expect(getByText(/Order #1/)).toBeTruthy();
    expect(getByText(/\$25.97/)).toBeTruthy();
  });

  it('should display order status', () => {
    const { getAllByText } = render(
      <OrderCard {...mockOrderProps} />
    );

    const pendingElements = getAllByText(/Pending/i);
    expect(pendingElements.length).toBeGreaterThan(0);
  });

  it('should call onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <OrderCard {...mockOrderProps} onPress={onPressMock} />
    );

    const orderElement = getByText(/Order #1/).parent?.parent;
    if (orderElement) {
      fireEvent.press(orderElement);
      expect(onPressMock).toHaveBeenCalled();
    }
  });
});
