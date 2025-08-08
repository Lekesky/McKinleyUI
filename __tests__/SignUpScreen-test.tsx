import Signup from '@/app/Signup';
import { createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import api from '../services/api';

// Mock the Firebase auth module to prevent actual network calls
jest.mock('@react-native-firebase/auth', () => ({
  getAuth: jest.fn(() => ({
        currentUser: {
            delete: jest.fn().mockResolvedValue(undefined),
            updateProfile: jest.fn().mockResolvedValue(undefined)
        }
    })),
  createUserWithEmailAndPassword: jest.fn(),
}));

// Mock the router to prevent navigation errors during tests
jest.mock('expo-router', () => ({
            router: { 
                replace: jest.fn()
            },
}));

// Mock the API service to prevent actual network calls
jest.mock('../services/api', () => ({
    post: jest.fn(),
    delete: jest.fn()
}));

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('<Signup />', () => {
    //Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        mockConsoleLog.mockClear();
        mockConsoleError.mockClear();
        mockAlert.mockClear();
    });

    test('renders the signup form', () => {
        const { getByPlaceholderText, getByText, getByTestId } = render(<Signup />);
        expect(getByPlaceholderText('First Name')).toBeTruthy();
        expect(getByPlaceholderText('Last Name')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Phone Number')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
        expect(getByTestId('Signup')).toBeTruthy();
        expect(getByText("Already have an account? Login")).toBeTruthy();
    });

    test('signup calls createUserWithEmailAndPassword with correct parameters', async () => {
        (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });
        const { getByPlaceholderText, getByTestId } = render(<Signup />);
        fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Phone Number'), '1234567890');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
        fireEvent.press(getByTestId('Signup'));

        await waitFor(() => {
            expect(getByPlaceholderText('Password').props.value).toBe(getByPlaceholderText('Confirm Password').props.value)
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
            expect(router.replace).toHaveBeenCalledWith('/(tabs)/Home');
        });
    });

    test('shows alert when passwords do not match', async () => {
        const { getByPlaceholderText, getByTestId } = render(<Signup />);
        fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
        fireEvent.changeText(getByPlaceholderText('Phone Number'), '1234567890');
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password456');
        fireEvent.press(getByTestId('Signup'));
        
        expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Passwords do not match!');
    });

    test('handles email already in use error', async () => {
        (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({ 
            code: 'auth/email-already-in-use' 
        });
        
        const { getByPlaceholderText, getByTestId } = render(<Signup />);
        fireEvent.changeText(getByPlaceholderText('Email'), 'existing@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
        fireEvent.press(getByTestId('Signup'));

        await waitFor(() => {
            expect(console.log).toHaveBeenCalledWith('That email address is already in use!');
        });
    });

    test('creates user in API after successful Firebase signup', async () => {
        const mockUid = '123';
        (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ 
            user: { uid: mockUid } 
        });
        
        const { getByPlaceholderText, getByTestId } = render(<Signup />);
        fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Phone Number'), '1234567890');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
        fireEvent.press(getByTestId('Signup'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/user', {
                uid: mockUid,
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@example.com',
                phoneNumber: '11234567890'
            });
        });
    });

    test('handles invalid email error', async () => {
        // Mock Firebase to reject with invalid email error
        (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({ 
            code: 'auth/invalid-email' 
        });
        
        const { getByPlaceholderText, getByTestId } = render(<Signup />);
        
        // Fill in form with invalid email
        fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
        fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
        fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
        fireEvent.changeText(getByPlaceholderText('Phone Number'), '1234567890');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
        
        // Trigger signup
        fireEvent.press(getByTestId('Signup'));

        // Verify error handling
        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
                expect.anything(), 
                'invalid-email', 
                'password123'
            );
            expect(mockConsoleLog).toHaveBeenCalledWith('That email address is invalid!');
            expect(router.replace).not.toHaveBeenCalled();
        });
    });

    test('navigates to login page when link is pressed', () => {
        const { getByText } = render(<Signup />);
        fireEvent.press(getByText("Already have an account? Login"));
        expect(router.replace).toHaveBeenCalledWith('/Login');
    });
});