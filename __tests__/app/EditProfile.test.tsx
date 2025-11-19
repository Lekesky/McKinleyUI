import EditProfile from '@/app/EditProfile';
import { useAuth } from '@/context/AuthContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('expo-router');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EditProfile Screen', () => {
  const mockApiClient = {
    get: jest.fn(),
    put: jest.fn(),
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
    
    mockApiClient.get.mockResolvedValue({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
      },
    });
  });

  it('should render edit profile form', async () => {
    const { getByPlaceholderText } = render(<EditProfile />);

    await waitFor(() => {
      expect(getByPlaceholderText('First Name')).toBeTruthy();
      expect(getByPlaceholderText('Last Name')).toBeTruthy();
      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    });
  });

  it('should fetch user data on mount', async () => {
    render(<EditProfile />);

    await waitFor(() => {
      expect(mockApiClient.get).toHaveBeenCalledWith('/user/user-123');
    });
  });

  it('should populate form with user data', async () => {
    const { getByPlaceholderText } = render(<EditProfile />);

    await waitFor(() => {
      expect(getByPlaceholderText('First Name').props.value).toBe('John');
      expect(getByPlaceholderText('Last Name').props.value).toBe('Doe');
      expect(getByPlaceholderText('Email').props.value).toBe('john@example.com');
    });
  });

  it('should update state when typing in fields', async () => {
    const { getByPlaceholderText } = render(<EditProfile />);

    await waitFor(() => {
      const firstNameInput = getByPlaceholderText('First Name');
      fireEvent.changeText(firstNameInput, 'Jane');
      expect(firstNameInput.props.value).toBe('Jane');
    });
  });

  it('should call update API on save', async () => {
    mockApiClient.put.mockResolvedValue({ data: { success: true } });

    const { getByText, getByPlaceholderText } = render(<EditProfile />);

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('First Name'), 'Jane');
      fireEvent.press(getByText('Update Profile'));
    });

    await waitFor(() => {
      expect(mockApiClient.put).toHaveBeenCalledWith(
        '/user/user-123',
        expect.objectContaining({
          firstName: 'Jane',
        })
      );
    });
  });
});
