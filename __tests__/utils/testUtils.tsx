import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { TabBarProvider } from '@/context/TabBarContext';
import { TableProvider } from '@/context/TableContext';
import { render, RenderOptions } from '@testing-library/react-native';
import React, { ReactElement } from 'react';

// All providers wrapper for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <TabBarProvider>
          <TableProvider>
            {children}
          </TableProvider>
        </TabBarProvider>
      </CartProvider>
    </AuthProvider>
  );
};

// Custom render function with all providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';
export { customRender as render };

// Mock data helpers
export const mockMenuItem = {
  id: '1',
  name: 'Test Item',
  description: 'Test Description',
  price: '10.99',
  imageURL: 'https://example.com/image.jpg',
};

export const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  role: 'CUSTOMER',
};

export const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};
