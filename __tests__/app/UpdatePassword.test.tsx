import UpdatePassword from '@/app/UpdatePassword';
import { useAuth } from '@/context/AuthContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('expo-router');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UpdatePassword Screen', () => {
  const mockApiClient = {
    put: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      uid: 'user-123',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
  });

  it('should render password update form', () => {
    const { getByPlaceholderText } = render(<UpdatePassword />);

    expect(getByPlaceholderText('Old Password')).toBeTruthy();
    expect(getByPlaceholderText('New Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
  });

  it('should update state when typing in fields', () => {
    const { getByPlaceholderText } = render(<UpdatePassword />);

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'oldpass');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'newpass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'newpass123');

    expect(getByPlaceholderText('Old Password').props.value).toBe('oldpass');
    expect(getByPlaceholderText('New Password').props.value).toBe('newpass123');
  });

  it('should call update API on submit', async () => {
    mockApiClient.patch.mockResolvedValue({ data: { success: true } });

    const { getAllByText, getByPlaceholderText } = render(<UpdatePassword />);

    fireEvent.changeText(getByPlaceholderText('Old Password'), 'oldpass');
    fireEvent.changeText(getByPlaceholderText('New Password'), 'newpass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'newpass123');

    // Get the button (second occurrence of "Update Password" text)
    const buttons = getAllByText('Update Password');
    fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(mockApiClient.patch).toHaveBeenCalled();
    });
  });

  it('should validate password confirmation', () => {
    const { getByPlaceholderText } = render(<UpdatePassword />);

    fireEvent.changeText(getByPlaceholderText('New Password'), 'newpass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'different');

    expect(getByPlaceholderText('New Password').props.value).toBe('newpass123');
    expect(getByPlaceholderText('Confirm Password').props.value).toBe('different');
  });
});
