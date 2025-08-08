import { signOut } from '@react-native-firebase/auth';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Profile from '../app/(tabs)/Profile';

// Mock navigation and any other dependencies if needed
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('@react-native-firebase/auth', () => ({
  getAuth: () => ({
    currentUser: { email: 'test@example.com' },
  }),
  EmailAuthProvider: { credential: jest.fn() },
  reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
}));


describe('Profile Screen', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders profile actions', () => {
        const { getByText } = render(<Profile />);
        expect(getByText('Logout')).toBeTruthy();
        expect(getByText('Update Password')).toBeTruthy();
        expect(getByText('Delete Account')).toBeTruthy();
    });

    it('handles logout press', () => {
        const { getByText } = render(<Profile />);
        fireEvent.press(getByText('Logout'));
       
        expect(signOut).toHaveBeenCalled();

    });

    it('handles update password press', () => {
        const { getByText } = render(<Profile />);
        fireEvent.press(getByText('Update Password'));
    });

    it('handles delete account press', () => {
        const { getByText } = render(<Profile />);
        fireEvent.press(getByText('Delete Account'));
    });
});