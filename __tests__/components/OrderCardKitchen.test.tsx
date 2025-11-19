import OrderCardKitchen from '@/components/OrderCardKitchen';
import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-paper', () => {
  const mockReact = require('react');
  const { Text: MockText, View: MockView } = require('react-native');
  
  const flattenChildren = (children: any): string => {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return String(children);
    if (Array.isArray(children)) {
      return children.map(flattenChildren).join('');
    }
    if (children && typeof children === 'object' && children.props) {
      return flattenChildren(children.props.children);
    }
    return '';
  };

  return {
    Card: ({ children, style }: any) => mockReact.createElement(MockView, { style }, children),
    Text: ({ children, style }: any) => mockReact.createElement(MockText, { style }, flattenChildren(children)),
    Button: ({ children, onPress }: any) => 
      mockReact.createElement(MockView, { onPress }, children),
    Icon: ({ source }: any) => mockReact.createElement(MockView, {}, source),
  };
});

describe('OrderCardKitchen', () => {
  const mockOrder = {
    id: '123',
    customer: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '555-1234',
    },
    waitress: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '555-5678',
    },
    orderNumber: 'ORD-001',
    orderedItems: [
      { id: '1', name: 'Burger', quantity: 2, price: 10.99 },
      { id: '2', name: 'Fries', quantity: 1, price: 3.99 },
    ],
    totalPrice: 25.97,
    status: 'PENDING',
    paymentStatus: 'UNPAID',
    orderDate: '2024-01-01T12:00:00Z',
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render kitchen order card', () => {
    const { getByText } = render(
      <OrderCardKitchen 
        id={mockOrder.id}
        customer={mockOrder.customer}
        waitress={mockOrder.waitress}
        orderNumber={mockOrder.orderNumber}
        orderedItems={mockOrder.orderedItems}
        totalPrice={mockOrder.totalPrice}
        status={mockOrder.status}
        paymentStatus={mockOrder.paymentStatus}
        orderDate={mockOrder.orderDate}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Order #ORD-001')).toBeTruthy();
    expect(getByText('Burger')).toBeTruthy();
    expect(getByText('2×')).toBeTruthy();
  });

  it('should show order items', () => {
    const { getByText } = render(
      <OrderCardKitchen 
        id={mockOrder.id}
        customer={mockOrder.customer}
        waitress={mockOrder.waitress}
        orderNumber={mockOrder.orderNumber}
        orderedItems={mockOrder.orderedItems}
        totalPrice={mockOrder.totalPrice}
        status={mockOrder.status}
        paymentStatus={mockOrder.paymentStatus}
        orderDate={mockOrder.orderDate}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Burger')).toBeTruthy();
    expect(getByText('Fries')).toBeTruthy();
  });

  it('should display start order button for pending orders', () => {
    const { getByText } = render(
      <OrderCardKitchen 
        id={mockOrder.id}
        customer={mockOrder.customer}
        waitress={mockOrder.waitress}
        orderNumber={mockOrder.orderNumber}
        orderedItems={mockOrder.orderedItems}
        totalPrice={mockOrder.totalPrice}
        status={mockOrder.status}
        paymentStatus={mockOrder.paymentStatus}
        orderDate={mockOrder.orderDate}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Start Order')).toBeTruthy();
  });

  it('should display order timestamp', () => {
    const { getByText } = render(
      <OrderCardKitchen 
        id={mockOrder.id}
        customer={mockOrder.customer}
        waitress={mockOrder.waitress}
        orderNumber={mockOrder.orderNumber}
        orderedItems={mockOrder.orderedItems}
        totalPrice={mockOrder.totalPrice}
        status={mockOrder.status}
        paymentStatus={mockOrder.paymentStatus}
        orderDate={mockOrder.orderDate}
        onPress={mockOnPress}
      />
    );

    // Timestamp will vary by timezone - check it contains time format
    expect(getByText(/\d{1,2}:\d{2}:\d{2}/)).toBeTruthy();
  });
});
