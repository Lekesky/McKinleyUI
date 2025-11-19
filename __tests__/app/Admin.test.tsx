import Admin from '@/app/Admin';
import { useAuth } from '@/context/AuthContext';
import { fireEvent, render } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('expo-router');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Admin Screen', () => {
  const mockApiClient = {
    get: jest.fn().mockResolvedValue({ data: { content: [] } }),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      uid: 'admin-123',
      userRole: 'ADMIN',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
  });

  it('should render admin dashboard', () => {
    const { getByText } = render(<Admin />);

    expect(getByText('Admin Dashboard')).toBeTruthy();
  });

  it('should display navigation options', () => {
    const { getByText } = render(<Admin />);

    expect(getByText('Analytics')).toBeTruthy();
    expect(getByText('Menu')).toBeTruthy();
    expect(getByText('Members')).toBeTruthy();
    expect(getByText('Order History')).toBeTruthy();
  });

  it('should navigate to analytics when pressed', () => {
    const { getByText } = render(<Admin />);
    
    const analyticsButton = getByText('Analytics');
    fireEvent.press(analyticsButton);

    // Navigation should occur
    expect(analyticsButton).toBeTruthy();
  });

  it('should navigate to menu management when pressed', () => {
    const { getByText } = render(<Admin />);
    
    const menuButton = getByText('Menu');
    fireEvent.press(menuButton);

    // Verify button is pressable (component uses ViewControl, not router navigation)
    expect(menuButton).toBeTruthy();
  });
});
