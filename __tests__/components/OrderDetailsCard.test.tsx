import OrderDetailsCard from '@/components/OrderDetailsCard';
import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-paper', () => ({
  Card: ({ children, style }: any) => <div style={style}>{children}</div>,
  Text: ({ children, style }: any) => <div style={style}>{children}</div>,
}));

describe('OrderDetailsCard', () => {
  const mockOrder = {
    orderNumber: '12345',
    orderedItems: [
      {
        id: '1',
        name: 'Burger',
        quantity: 2,
        price: 10.99,
      },
    ],
    totalPrice: 21.98,
    status: 'PENDING',
    paymentStatus: 'UNPAID',
  };

  const mockOnPress = jest.fn();

  it('should render order item details', () => {
    const { getByText } = render(
      <OrderDetailsCard 
        orderNumber={mockOrder.orderNumber}
        orderedItems={mockOrder.orderedItems}
        totalPrice={mockOrder.totalPrice}
        status={mockOrder.status}
        paymentStatus={mockOrder.paymentStatus}
        onPress={mockOnPress}
      />
    );

    expect(getByText(/Burger/)).toBeTruthy();
    expect(getByText(/×2/)).toBeTruthy();
  });

  it('should display quantity and price', () => {
    const { getByText } = render(
      <OrderDetailsCard 
        orderNumber={mockOrder.orderNumber}
        orderedItems={mockOrder.orderedItems}
        totalPrice={mockOrder.totalPrice}
        status={mockOrder.status}
        paymentStatus={mockOrder.paymentStatus}
        onPress={mockOnPress}
      />
    );

    expect(getByText(/×2/)).toBeTruthy();
    expect(getByText(/10\.99/)).toBeTruthy();
  });

  it('should handle single quantity items', () => {
    const singleItemOrder = {
      ...mockOrder,
      orderedItems: [{ ...mockOrder.orderedItems[0], quantity: 1 }],
    };
    const { getByText } = render(
      <OrderDetailsCard 
        orderNumber={singleItemOrder.orderNumber}
        orderedItems={singleItemOrder.orderedItems}
        totalPrice={singleItemOrder.totalPrice}
        status={singleItemOrder.status}
        paymentStatus={singleItemOrder.paymentStatus}
        onPress={mockOnPress}
      />
    );

    expect(getByText(/×1/)).toBeTruthy();
  });
});
