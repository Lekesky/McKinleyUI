import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useAuth0 } from "react-native-auth0";
import { getAuth0CredentialsArgs } from "@/services/auth0";
import { API_URL } from "../services/api";
import { createSSEConnection } from "../services/sse";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageURL: string;
};

type CartItem = MenuItem & { quantity: number; selectedSideIds?: string[] };

type CartType = 'CUSTOMER' | 'WAITRESS';

type CartContextType = {
  cart: Record<CartType, CartItem[]>;
  isCartPaused: boolean
  addToCart: (item: MenuItem, quantity: number, selectedSideIds?: string[], type?: CartType) => void;
  removeFromCart: (itemId: string, type?: CartType) => void;
  removeSideFromItem: (itemId: string, sideId: string, type?: CartType) => void;
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
  const { getCredentials, user } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isCartPaused, setIsCartPaused] = useState<boolean>(false);

  const refreshAccessToken = useCallback(async (forceRefresh: boolean = false) => {
    if (!user) {
      setAccessToken(null);
      return null;
    }

    try {
      const token = await getCredentials(...getAuth0CredentialsArgs(forceRefresh));
      setAccessToken(token.accessToken);
      return token;
    } catch {
      setAccessToken(null);
      return null;
    }
  }, [getCredentials, user]);

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

  useEffect(() => {
    void refreshAccessToken();
  }, [refreshAccessToken]);


  // Get the active cart based on type (defaults to customer)
  const getActiveCart = (type: CartType = 'CUSTOMER') => {
    return cart[type];
  };

  useEffect(() => {
      // Only establish SSE connection once we have an access token to authenticate the stream.
      if (!user || !accessToken) {
        return;
      }
      
      const streamUrl = `${API_URL}/orders/stream?streamMessage=FULFILLMENT_STATUS`;
      
      let closeConnection: (() => void) | null = null;
      
      try {
        closeConnection = createSSEConnection(
          streamUrl,
          accessToken,
          {
            onOpen: () => {
              console.log('SSE connection opened');
            },
            onMessage: (data) => {
              if(data?.paused === undefined) return;
              setIsCartPaused(data.paused);
            },
            onError: (error) => {
              console.error('SSE error:', error);
            },
          }
        );
      } catch (error) {
        console.error('Failed to create SSE connection:', error);
      }

      return () => {
        if (closeConnection) {
          closeConnection();
        }
      };
  }, [accessToken, user]);


  const addToCart = useCallback((item: MenuItem, quantity: number, selectedSideIds: string[] = [], type: CartType = 'CUSTOMER') => {
    setCart(prevCart => {
      const currentCart = [...prevCart[type]];
      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity += quantity;
        if (selectedSideIds.length > 0) {
          currentCart[existingItemIndex].selectedSideIds = selectedSideIds;
        }
      } else {
        currentCart.push({ ...item, quantity, selectedSideIds: selectedSideIds.length > 0 ? selectedSideIds : undefined });
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

  const removeSideFromItem = useCallback((itemId: string, sideId: string, type: CartType = 'CUSTOMER') => {
    setCart(prevCart => {
      const currentCart = [...prevCart[type]];
      const itemIndex = currentCart.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return prevCart; // Item not found, return unchanged cart
      }
      
      const item = currentCart[itemIndex];
      if (!item.selectedSideIds || item.selectedSideIds.length === 0) {
        return prevCart; // No sides to remove
      }
      
      // Remove the specific side from the item
      const updatedSideIds = item.selectedSideIds.filter(id => id !== sideId);
      currentCart[itemIndex] = {
        ...item,
        selectedSideIds: updatedSideIds.length > 0 ? updatedSideIds : undefined
      };

      // Save to AsyncStorage
      AsyncStorage.setItem('cart_' + type, JSON.stringify(currentCart))
        .catch(() => {
          // Silent error - failed to save cart
        });
      
      return {
        ...prevCart,
        [type]: currentCart
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
      isCartPaused,
      addToCart, 
      removeFromCart,
      removeSideFromItem,
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
