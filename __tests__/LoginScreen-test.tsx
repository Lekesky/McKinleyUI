import Login from '@/app/Login';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

// Mock the Firebase auth module to prevent actual network calls
jest.mock('@react-native-firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock the router to prevent navigation errors during tests
jest.mock('expo-router', () => ({
            router: { 
                replace: jest.fn()
            },
}));

describe('<Login />', () => {
    //Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the login form', () => {
        const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByTestId('LoginButton')).toBeTruthy();
        expect(getByText("Don't have an account? Sign up")).toBeTruthy();
    });

    test('loginHandler calls signInWithEmailAndPassword with correct parameters', async () => {
        (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });
        const { getByPlaceholderText, getByTestId } = render(<Login />);
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(getByTestId('LoginButton'));

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), 'test@example.com', 'password123');
            expect(router.replace).toHaveBeenCalledWith('/(tabs)/Home');
        });
    });

    test('loginHandler shows alert on error', async () => {
        (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));
        const { getByPlaceholderText, getByTestId } = render(<Login />);
        fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
        fireEvent.press(getByTestId('LoginButton'));
        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), 'wrong@example.com', 'wrongpassword');
            expect(router.replace).not.toHaveBeenCalled();
        });
    });

    test('navigates to Signup page when link is pressed', () => {
        const { getByText } = render(<Login />);
        fireEvent.press(getByText("Don't have an account? Sign up"));
        expect(router.replace).toHaveBeenCalledWith('/Signup');
    });
});