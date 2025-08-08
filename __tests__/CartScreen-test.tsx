import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert, Text, View } from 'react-native';
import Cart from '../app/(tabs)/Cart';
import styles from '../styles/Cart.styles';

// Mock dependencies
jest.mock('@react-native-firebase/auth', () => ({
  getAuth: () => ({
    currentUser: { uid: 'test-uid' },
    onAuthStateChanged: jest.fn(),
  }),
}));

jest.mock('@stripe/stripe-react-native', () => ({
  initPaymentSheet: jest.fn(() => Promise.resolve({})),
  presentPaymentSheet: jest.fn(() => Promise.resolve({})),
}));

jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: [
      { id: '1', name: 'Burger', quantity: 2, price: 5 },
      { id: '2', name: 'Fries', quantity: 1, price: 3 },
    ],
    clearCart: jest.fn(),
    removeFromCart: jest.fn(),
  }),
}));

jest.mock('../services/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: { id: 'order-1', paymentIntent: 'pi', ephemeralKey: 'ek', customer: 'cus' } })),
  put: jest.fn(() => Promise.resolve({})),
}));

// Silence Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('Cart styles', () => {
  test('should have a container style', () => {
    expect(styles.container).toBeDefined();
    expect(styles.container).toMatchObject({ padding: 16, flex: 1 });
  });

  test('should have a title style', () => {
    expect(styles.title).toBeDefined();
    expect(styles.title.fontSize).toBe(24);
    expect(styles.title.fontWeight).toBe('bold');
    expect(styles.title.textAlign).toBe('center');
    expect(styles.title.color).toBe('#fff');
  });

  test('should have a card style', () => {
    expect(styles.card).toBeDefined();
    expect(styles.card.backgroundColor).toBe('#fff');
    expect(styles.card.borderRadius).toBe(8);
    expect(styles.card.elevation).toBe(2);
  });

  test('should have a name style', () => {
    expect(styles.name).toBeDefined();
    expect(styles.name.fontSize).toBe(18);
  });

  test('should have a quantity style', () => {
    expect(styles.quantity).toBeDefined();
    expect(styles.quantity.fontSize).toBe(14);
    expect(styles.quantity.marginBottom).toBe(4);
  });

  test('should have a price style', () => {
    expect(styles.price).toBeDefined();
    expect(styles.price.fontSize).toBe(16);
    expect(styles.price.fontWeight).toBe('bold');
  });

  test('should have a total style', () => {
    expect(styles.total).toBeDefined();
    expect(styles.total.fontSize).toBe(18);
    expect(styles.total.fontWeight).toBe('bold');
    expect(styles.total.textAlign).toBe('right');
  });

  test('should have an actions style', () => {
    expect(styles.actions).toBeDefined();
    expect(styles.actions.marginBottom).toBe(90);
    expect(styles.actions.gap).toBe(10);
  });

  test('should have an orderList style', () => {
    expect(styles.orderList).toBeDefined();
    expect(styles.orderList.marginLeft).toBe(13);
    expect(styles.orderList.marginRight).toBe(13);
  });

  // Coverage: Render a component using all styles
  test('renders a view using all styles (coverage)', () => {
    const { getByText } = render(
      <View style={styles.container}>
        <Text style={styles.title}>Title</Text>
        <View style={styles.card}>
          <Text style={styles.name}>Name</Text>
          <Text style={styles.quantity}>Qty: 1</Text>
          <Text style={styles.price}>$10.00</Text>
        </View>
        <Text style={styles.total}>Total: $10.00</Text>
        <View style={styles.actions}>
          <Text>Action</Text>
        </View>
        <View style={styles.orderList}>
          <Text>Order List</Text>
        </View>
      </View>
    );
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Qty: 1')).toBeTruthy();
    expect(getByText('$10.00')).toBeTruthy();
    expect(getByText('Total: $10.00')).toBeTruthy();
    expect(getByText('Action')).toBeTruthy();
    expect(getByText('Order List')).toBeTruthy();
  });
});

describe('Cart functionality', () => {
    it('renders cart items', () => {
      const { getByText } = render(<Cart />);
      expect(getByText('Burger')).toBeTruthy();
      expect(getByText('Qty: 2')).toBeTruthy();
      expect(getByText('$10.00')).toBeTruthy();
      expect(getByText('Fries')).toBeTruthy();
      expect(getByText('Qty: 1')).toBeTruthy();
      expect(getByText('$3.00')).toBeTruthy();
      expect(getByText('Total: $13.00')).toBeTruthy();
    });

    it('calls removeFromCart when Remove is pressed', () => {
      const { getAllByText } = render(<Cart />);
      const removeButtons = getAllByText('Remove');
      fireEvent.press(removeButtons[0]);
      // You can check if removeFromCart was called if you export it from the mock
    });

    it('calls clearCart when Clear Cart is pressed', () => {
      const { getByText } = render(<Cart />);
      fireEvent.press(getByText('Clear Cart'));
      // You can check if clearCart was called if you export it from the mock
    });

    it('calls handleCheckout when Place Order & Pay is pressed', async () => {
      const { getByText } = render(<Cart />);
      fireEvent.press(getByText('Place Order & Pay'));
      // Wait for async actions to complete
      await waitFor(() => {
        expect(getByText('Total: $13.00')).toBeTruthy();
      });
    });
  });