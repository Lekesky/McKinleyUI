import { CartProvider, useCart } from '@/context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

const mockMenuItem = {
  id: '1',
  name: 'Test Item',
  description: 'Test Description',
  price: '10.99',
  imageURL: 'https://example.com/image.jpg',
};

const mockMenuItem2 = {
  id: '2',
  name: 'Second Item',
  description: 'Another item',
  price: '15.50',
  imageURL: 'https://example.com/image2.jpg',
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should throw error when useCart is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
    
    consoleError.mockRestore();
  });

  it('should initialize with empty carts', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.getActiveCart('CUSTOMER')).toEqual([]);
    });
    
    expect(result.current.getActiveCart('WAITRESS')).toEqual([]);
    expect(result.current.getTotalItemCount('CUSTOMER')).toBe(0);
    expect(result.current.getTotal('CUSTOMER')).toBe('0.00');
  });

  it('should add item to customer cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 2, 'CUSTOMER');
    });

    await waitFor(() => {
      const cart = result.current.getActiveCart('CUSTOMER');
      expect(cart).toHaveLength(1);
      expect(cart[0].id).toBe(mockMenuItem.id);
      expect(cart[0].quantity).toBe(2);
    });
    
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('should add item to waitress cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 1, 'WAITRESS');
    });

    await waitFor(() => {
      expect(result.current.getActiveCart('WAITRESS')).toHaveLength(1);
    });

    expect(result.current.getActiveCart('CUSTOMER')).toHaveLength(0);
  });

  it('should increment quantity when adding existing item', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 1, 'CUSTOMER');
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 2, 'CUSTOMER');
    });

    await waitFor(() => {
      const cart = result.current.getActiveCart('CUSTOMER');
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(3);
    });
  });

  it('should remove item from cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 3, 'CUSTOMER');
    });

    act(() => {
      result.current.removeFromCart(mockMenuItem.id, 'CUSTOMER');
    });

    await waitFor(() => {
      const cart = result.current.getActiveCart('CUSTOMER');
      expect(cart[0].quantity).toBe(2);
    });
  });

  it('should remove item completely when quantity is 1', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 1, 'CUSTOMER');
    });

    act(() => {
      result.current.removeFromCart(mockMenuItem.id, 'CUSTOMER');
    });

    await waitFor(() => {
      expect(result.current.getActiveCart('CUSTOMER')).toHaveLength(0);
    });
  });

  it('should calculate total correctly', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 2, 'CUSTOMER');
      result.current.addToCart(mockMenuItem2, 1, 'CUSTOMER');
    });

    await waitFor(() => {
      const total = result.current.getTotal('CUSTOMER');
      expect(total).toBe('37.48'); // (10.99 * 2) + (15.50 * 1) = 37.48
    });
  });

  it('should calculate total item count correctly', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 2, 'CUSTOMER');
      result.current.addToCart(mockMenuItem2, 3, 'CUSTOMER');
    });

    await waitFor(() => {
      expect(result.current.getTotalItemCount('CUSTOMER')).toBe(5);
    });
  });

  it('should clear specific cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 2, 'CUSTOMER');
    });
    
    await waitFor(() => {
      expect(result.current.getActiveCart('CUSTOMER')).toHaveLength(1);
    });
    
    act(() => {
      result.current.addToCart(mockMenuItem, 1, 'WAITRESS');
    });
    
    await waitFor(() => {
      expect(result.current.getActiveCart('WAITRESS')).toHaveLength(1);
    });

    await act(async () => {
      await result.current.clearCart('CUSTOMER');
    });

    await waitFor(() => {
      expect(result.current.getActiveCart('CUSTOMER')).toHaveLength(0);
      expect(result.current.getActiveCart('WAITRESS')).toHaveLength(1);
    });
    
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('cart_CUSTOMER');
  });

  it('should clear all carts when no type specified', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart(mockMenuItem, 2, 'CUSTOMER');
    });
    
    act(() => {
      result.current.addToCart(mockMenuItem, 1, 'WAITRESS');
    });

    await act(async () => {
      await result.current.clearCart();
    });

    await waitFor(() => {
      expect(result.current.getActiveCart('CUSTOMER')).toHaveLength(0);
    });
    
    expect(result.current.getActiveCart('WAITRESS')).toHaveLength(0);
  });

  it('should load cart from storage on mount', async () => {
    const savedCart = [
      { ...mockMenuItem, quantity: 2 },
      { ...mockMenuItem2, quantity: 1 },
    ];

    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'cart_CUSTOMER') return Promise.resolve(JSON.stringify(savedCart));
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.getActiveCart('CUSTOMER')).toHaveLength(2);
    });

    expect(result.current.getTotalItemCount('CUSTOMER')).toBe(3);
  });
});
