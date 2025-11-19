import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageURL: string;
};

type CartItem = MenuItem & { quantity: number };

type CartType = 'CUSTOMER' | 'WAITRESS';

type CartContextType = {
  cart: Record<CartType, CartItem[]>;
  addToCart: (item: MenuItem, quantity: number, type?: CartType) => void;
  removeFromCart: (itemId: string, type?: CartType) => void;
  clearCart: (type?: CartType) => void;
  getActiveCart: (type?: CartType) => CartItem[];
  getTotal: (type?: CartType) => string;
  getTotalItemCount: (type?: CartType) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Record<CartType, CartItem[]>>({
    CUSTOMER: [],
    WAITRESS: []
  });

  const loadCart = useCallback(() => {
    return Promise.all([
      AsyncStorage.getItem('cart_CUSTOMER'),
      AsyncStorage.getItem('cart_WAITRESS')
    ])
      .then(([customerCartData, waitressCartData]) => {
        const newCart: Record<CartType, CartItem[]> = {
          CUSTOMER: customerCartData ? JSON.parse(customerCartData) : [],
          WAITRESS: waitressCartData ? JSON.parse(waitressCartData) : []
        };
        setCart(newCart);
      })
      .catch(() => {
        // Silent error - failed to load cart
      });
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Get the active cart based on type (defaults to customer)
  const getActiveCart = (type: CartType = 'CUSTOMER') => {
    return cart[type];
  };


  const addToCart = useCallback((item: MenuItem, quantity: number, type: CartType = 'CUSTOMER') => {
    setCart(prevCart => {
      const currentCart = [...prevCart[type]];
      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        currentCart.push({ ...item, quantity });
      }

      const newCart = {
        ...prevCart,
        [type]: currentCart
      };

      // Save to AsyncStorage
      AsyncStorage.setItem('cart_' + type, JSON.stringify(currentCart))
        .catch(() => {
          // Silent error - failed to save cart
        });

      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((itemId: string, type: CartType = 'CUSTOMER') => {
    setCart(prevCart => {
      const currentCart = [...prevCart[type]];
      const itemIndex = currentCart.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return prevCart; // Item not found, return unchanged cart
      }
      
      let updatedCart;
      
      // If quantity is greater than 1, just decrement
      if (currentCart[itemIndex].quantity > 1) {
        currentCart[itemIndex].quantity -= 1;
        updatedCart = currentCart;
      } else {
        // Otherwise remove the item entirely
        updatedCart = currentCart.filter(item => item.id !== itemId);
      }

      // Save to AsyncStorage
      AsyncStorage.setItem('cart_' + type, JSON.stringify(updatedCart))
        .catch(() => {
          // Silent error - failed to save cart
        });
      
      return {
        ...prevCart,
        [type]: updatedCart
      };
    });
  }, []);

  const clearCart = useCallback((type?: CartType) => {
    if (type) {
      setCart(prevCart => ({
        ...prevCart,
        [type]: []
      }));
      return AsyncStorage.removeItem('cart_' + type)
        .catch(() => {
          // Silent error
        });
    } else {
      setCart({
        CUSTOMER: [],
        WAITRESS: []
      });
      return Promise.all([
        AsyncStorage.removeItem('cart_CUSTOMER'),
        AsyncStorage.removeItem('cart_WAITRESS')
      ])
        .catch(() => {
          // Silent error
        });
    }
  }, []);

  const getTotal = useCallback((type: CartType = 'CUSTOMER') => {
    return cart[type].reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  }, [cart]);

  const getTotalItemCount = useCallback((type: CartType = 'CUSTOMER') => {
    return cart[type].reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);


  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart,
      clearCart, 
      getActiveCart,
      getTotal, 
      getTotalItemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
