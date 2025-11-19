import HomeScreen from '@/app/(tabs)/Home';
import { useAuth } from '@/context/AuthContext';
import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('@/components/ui/CustomerHome', () => {
  const mockReact = require('react');
  const { Text: MockText } = require('react-native');
  return function MockCustomerHome() {
    return mockReact.createElement(MockText, {}, 'Customer Home');
  };
});
jest.mock('@/components/ui/WaitressHome', () => {
  const mockReact = require('react');
  const { Text: MockText } = require('react-native');
  return function MockWaitressHome() {
    return mockReact.createElement(MockText, {}, 'Waitress Home');
  };
});
jest.mock('@/components/ViewSwitcher', () => {
  const mockReact = require('react');
  const { Text: MockText } = require('react-native');
  return {
    __esModule: true,
    default: function MockViewControl() {
      return mockReact.createElement(MockText, {}, 'View Switcher');
    },
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render customer view for customer role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'CUSTOMER' });

    const { getByText, queryByText } = render(<HomeScreen />);

    expect(getByText('Customer Home')).toBeTruthy();
    expect(queryByText('View Switcher')).toBeNull();
  });

  it('should render view switcher for waitress role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'WAITRESS' });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('View Switcher')).toBeTruthy();
  });

  it('should render view switcher for admin role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'ADMIN' });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('View Switcher')).toBeTruthy();
  });

  it('should render view switcher for chef role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'CHEF' });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('View Switcher')).toBeTruthy();
  });

  it('should not render view switcher for customer role', () => {
    (useAuth as jest.Mock).mockReturnValue({ userRole: 'CUSTOMER' });

    const { queryByText } = render(<HomeScreen />);

    expect(queryByText('View Switcher')).toBeNull();
  });
});
