import MenuItem from '@/app/MenuItem';
import { useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { router } from 'expo-router';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: jest.fn(() => ({ id: '1' })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedRouter = router as jest.Mocked<typeof router>;

describe('MenuItem Screen', () => {
  const mockApiClient = {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (useAuth as jest.Mock).mockReturnValue({
      uid: 'user-123',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
    
    mockApiClient.get.mockResolvedValue({
      data: {
        id: '1',
        name: 'Burger',
        description: 'Delicious burger',
        price: '10.99',
        imageURL: 'https://example.com/burger.jpg',
      },
    });
  });

  const renderWithProviders = () => {
    return render(
      <CartProvider>
        <MenuItem />
      </CartProvider>
    );
  };

  it('should render menu item details', async () => {
    const { getByText } = renderWithProviders();

    // Wait for API to be called and component to update
    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith('/menu/1');
    }, { timeout: 500 });
    
    // Component should be mounted and data loaded
    expect(getByText('Burger')).toBeTruthy();
  });

  it('should fetch menu item details on mount', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/menu/')
      );
    });
  });

  it('should add item to cart when button pressed', async () => {
    const { getByText } = renderWithProviders();

    await waitFor(() => {
      expect(getByText('Burger')).toBeTruthy();
    });

    const addButton = getByText(/Add to Cart/);
    fireEvent.press(addButton);

    expect(mockedRouter.back).toHaveBeenCalled();
  });

  it('should handle quantity increment', async () => {
    const { getByText, UNSAFE_getAllByType } = renderWithProviders();

    await waitFor(() => {
      expect(getByText('Burger')).toBeTruthy();
    });

    // Get all IconButtons - back button, minus (index 1), plus (index 2)
    const iconButtons = UNSAFE_getAllByType('IconButton' as any);
    const plusButton = iconButtons[2]; // Third IconButton is the plus
    
    fireEvent.press(plusButton);
    fireEvent.press(plusButton);

    await waitFor(() => {
      expect(getByText('3')).toBeTruthy();
    });
  });

  it('should handle quantity decrement', async () => {
    const { getByText, UNSAFE_getAllByType } = renderWithProviders();

    await waitFor(() => {
      expect(getByText('Burger')).toBeTruthy();
    });

    // Get all IconButtons - back button, minus (index 1), plus (index 2)
    const iconButtons = UNSAFE_getAllByType('IconButton' as any);
    const minusButton = iconButtons[1];
    const plusButton = iconButtons[2];

    fireEvent.press(plusButton);
    fireEvent.press(plusButton);
    
    await waitFor(() => {
      expect(getByText('3')).toBeTruthy();
    });

    fireEvent.press(minusButton);

    await waitFor(() => {
      expect(getByText('2')).toBeTruthy();
    });
  });
});
