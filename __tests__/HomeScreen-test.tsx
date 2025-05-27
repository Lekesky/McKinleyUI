import HomeScreen from '@/app/(tabs)/Home';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';

// Mock the router to prevent navigation errors during tests
jest.mock('expo-router', () => ({
            router: { 
                push: jest.fn() 
            },
        }));

describe('<HomeScreen />', () => {
    test('renders the hero image', () => {
        const { getByTestId } = render(<HomeScreen />);
        expect(getByTestId('logo-image')).toBeTruthy();
    });

    test('renders the main title', () => {
        const { getByText } = render(<HomeScreen />);
        expect(getByText('🍽️ Welcome to McKinley Grill')).toBeTruthy();
    });

    test('renders the subtitle', () => {
        const { getByText } = render(<HomeScreen />);
        expect(getByText('Your favorite dishes, delivered fresh.')).toBeTruthy();
    });

    test('renders the "View Menu" button', () => {
        const { getByText } = render(<HomeScreen />);
        expect(getByText('View Menu')).toBeTruthy();
    });

    test('pressing "View Menu" button triggers navigation', () => {

        const { getByText } = render(<HomeScreen />);
        fireEvent.press(getByText('View Menu'));
        expect(router.push).toHaveBeenCalledWith('/(tabs)/Menu');
    });
});