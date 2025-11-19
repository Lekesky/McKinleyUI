import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider, useCart } from '@/context/CartContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

// Component that uses both contexts
const TestComponent = () => {
  const { uid, loginTokens } = useAuth();
  const { addToCart, getActiveCart } = useCart();

  return (
    <>
      <Text testID="uid">{uid || 'No User'}</Text>
      <Text testID="cart-count">{getActiveCart('CUSTOMER').length}</Text>
      <TouchableOpacity
        testID="login-btn"
        onPress={() => loginTokens('token', 'refresh', 'user-123')}
      >
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="add-item-btn"
        onPress={() =>
          addToCart(
            {
              id: '1',
              name: 'Test',
              description: 'Test',
              price: '10',
              imageURL: '',
            },
            1,
            'CUSTOMER'
          )
        }
      >
        <Text>Add Item</Text>
      </TouchableOpacity>
    </>
  );
};

describe('Integration: Auth + Cart', () => {
  it('should handle authentication and cart operations together', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthProvider>
    );

    // Initially no user
    expect(getByTestId('uid').props.children).toBe('No User');
    expect(getByTestId('cart-count').props.children).toBe(0);

    // Login
    fireEvent.press(getByTestId('login-btn'));

    await waitFor(() => {
      expect(getByTestId('uid').props.children).toBe('user-123');
    });

    // Add to cart
    await waitFor(async () => {
      fireEvent.press(getByTestId('add-item-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('cart-count').props.children).toBe(1);
    });
  });
});
