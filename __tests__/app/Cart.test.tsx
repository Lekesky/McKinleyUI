import Cart from '@/app/(tabs)/Cart';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/context/CartContext');
jest.mock('@/context/AuthContext');
jest.mock('@/components/StripeWrapper', () => {
  return function MockStripeWrapper({ children }: any) {
    return <div>{children}</div>;
  };
});

describe('Cart Screen', () => {
  const mockClearCart = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockGetActiveCart = jest.fn();
  const mockGetTotal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      uid: 'test-user-123',
      userRole: 'CUSTOMER',
    });

    (useCart as jest.Mock).mockReturnValue({
      getActiveCart: mockGetActiveCart,
      clearCart: mockClearCart,
      removeFromCart: mockRemoveFromCart,
      getTotal: mockGetTotal,
      getTotalItemCount: jest.fn(() => 2),
    });
  });

  it('should render empty cart message when cart is empty', () => {
    mockGetActiveCart.mockReturnValue([]);
    mockGetTotal.mockReturnValue('0.00');

    const { getByText } = render(<Cart />);

    expect(getByText('Your cart is empty.')).toBeTruthy();
  });

  it('should render cart items when cart has items', () => {
    const mockItems = [
      {
        id: '1',
        name: 'Burger',
        price: '10.99',
        quantity: 2,
        description: 'Tasty burger',
        imageURL: 'https://example.com/burger.jpg',
      },
    ];

    mockGetActiveCart.mockReturnValue(mockItems);
    mockGetTotal.mockReturnValue('21.98');

    const { getByText } = render(<Cart />);

    expect(getByText('Burger')).toBeTruthy();
    expect(getByText('Total: $21.98')).toBeTruthy();
  });

  it('should call clearCart when clear button is pressed', () => {
    const mockItems = [
      {
        id: '1',
        name: 'Pizza',
        price: '15.99',
        quantity: 1,
        description: 'Cheese pizza',
        imageURL: 'https://example.com/pizza.jpg',
      },
    ];

    mockGetActiveCart.mockReturnValue(mockItems);
    mockGetTotal.mockReturnValue('15.99');

    const { getByText } = render(<Cart />);
    const clearButton = getByText('Clear Cart');

    fireEvent.press(clearButton);

    expect(mockClearCart).toHaveBeenCalledWith('CUSTOMER');
  });
});
