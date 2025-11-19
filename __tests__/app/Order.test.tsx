import OrderScreen from '@/app/(tabs)/Order';
import { useAuth } from '@/context/AuthContext';
import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('@/components/ui/CustomerOrders', () => {
  return function MockCustomerOrders() {
    return <div>Customer Orders</div>;
  };
});
jest.mock('@/components/ui/KitchenOrders', () => {
  return function MockKitchenOrders() {
    return <div>Kitchen Orders</div>;
  };
});

describe('Order Screen', () => {
  it('should render customer view for customer role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'CUSTOMER' });

    const { getByText } = render(<OrderScreen />);

    expect(getByText('Customer Orders')).toBeTruthy();
  });

  it('should render view switcher for waitress role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'WAITRESS' });

    const { getByText } = render(<OrderScreen />);

    expect(getByText('Customer')).toBeTruthy();
    expect(getByText('Kitchen')).toBeTruthy();
  });

  it('should render view switcher for chef role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'CHEF' });

    const { getByText } = render(<OrderScreen />);

    expect(getByText('Customer')).toBeTruthy();
    expect(getByText('Kitchen')).toBeTruthy();
  });

  it('should render view switcher for admin role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'ADMIN' });

    const { getByText } = render(<OrderScreen />);

    expect(getByText('Customer')).toBeTruthy();
    expect(getByText('Kitchen')).toBeTruthy();
  });
});
