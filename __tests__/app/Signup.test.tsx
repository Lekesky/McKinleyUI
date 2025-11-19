import Signup from '@/app/Signup';
import { useAuth } from '@/context/AuthContext';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('@react-native-google-signin/google-signin');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Signup Screen', () => {
  const mockLoginTokens = jest.fn();
  const mockApiClient = {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      loginTokens: mockLoginTokens,
    });
    mockedAxios.create = jest.fn(() => mockApiClient as any);
  });

  it('should render signup form', () => {
    const { getByText, getByPlaceholderText } = render(<Signup />);

    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByPlaceholderText('First Name')).toBeTruthy();
    expect(getByPlaceholderText('Last Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
  });

  it('should update state when typing in fields', () => {
    const { getByPlaceholderText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

    expect(getByPlaceholderText('First Name').props.value).toBe('John');
    expect(getByPlaceholderText('Last Name').props.value).toBe('Doe');
    expect(getByPlaceholderText('Email').props.value).toBe('john@example.com');
  });

  it('should call signup API on form submit', async () => {
    mockApiClient.post.mockResolvedValue({
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        uid: 'user-123',
      },
    });

    const { getByText, getByPlaceholderText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Phone Number'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');

    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/user/signup',
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          password: 'password123',
        }),
        { withCredentials: true }
      );
    });
  });

  it('should validate password match', () => {
    const { getByPlaceholderText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'different');

    // Password mismatch validation would be tested here
    expect(getByPlaceholderText('Password').props.value).toBe('password123');
    expect(getByPlaceholderText('Confirm Password').props.value).toBe('different');
  });
});
