import React, { createContext, useContext, useState, ReactNode } from "react";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

type CartItem = MenuItem & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
        const existingItem = prev.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
            return prev.map((cartItem) =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
        } else {
            return [...prev, { ...item, quantity: 1 }];
        }
    });
  };

    const removeFromCart = (itemId: string) => {
        setCart((prev) => prev.map((item) => {
            if (item.id === itemId) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        })
        .filter((item) => item.id !== itemId));
    };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
