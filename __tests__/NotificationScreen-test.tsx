import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import Notification from '../app/(tabs)/Notification';

// Mock dependencies
jest.mock('@react-native-firebase/auth', () => ({
  getAuth: () => ({
    currentUser: { uid: 'test-uid' },
  }),
}));
const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock('../services/api', () => ({
  get: (...args : any[]) => mockGet(...args),
  post: (...args : any[]) => mockPost(...args),
}));

describe('Notification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator when loading', () => {
    mockGet.mockReturnValueOnce(new Promise(() => {})); // never resolves
    const { getByText } = render(<Notification />);
    expect(getByText('Loading notifications...')).toBeTruthy();
  });

  it('renders notifications', async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          userId: 'test-uid',
          title: 'Test Title',
          message: 'Test Message',
          timestamp: new Date().toISOString(),
          readStatus: false,
        },
      ],
    });
    const { getByText, findByText } = render(<Notification />);
    expect(await findByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
  });

  it('refreshes notifications on pull', async () => {
    mockGet.mockResolvedValue({
        data: [
        {
            id: '1',
            userId: 'test-uid',
            title: 'Test Title',
            message: 'Test Message',
            timestamp: new Date().toISOString(),
            readStatus: false,
        },
        ],
    });
    const { getByTestId } = render(<Notification />);
    // Wait for FlatList to appear
    await waitFor(() => {
        expect(getByTestId('notification-list')).toBeTruthy();
    });
    // Access the FlatList and its RefreshControl
    const flatList = getByTestId('notification-list');
    const refreshControl = flatList.props.refreshControl;
    // Call the onRefresh handler directly
    refreshControl.props.onRefresh();
    expect(mockGet).toHaveBeenCalledTimes(2);
    });

  it('marks notification as read on press', async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          userId: 'test-uid',
          title: 'Test Title',
          message: 'Test Message',
          timestamp: new Date().toISOString(),
          readStatus: false,
        },
      ],
    });
    mockPost.mockResolvedValueOnce({});
    const { findByText } = render(<Notification />);
    const notif = await findByText('Test Title');
    fireEvent.press(notif);
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/notifications/test-uid/read', { notificationId: '1' });
    });
  });
});