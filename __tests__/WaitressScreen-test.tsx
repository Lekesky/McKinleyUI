import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import WaitressScreen from '../app/(tabs)/Waitress';

// Mock any context or navigation used in WaitressScreen
jest.mock('../context/TableContext', () => ({
  useTable: () => ({
    tableNum: '',
    setTableNum: jest.fn(),
  }),
}));
jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

describe('WaitressScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<WaitressScreen />);
    expect(getByText('Take Order')).toBeTruthy();
  });

  it('allows entering table number and pressing enter', () => {
    const { getByTestId, getByText } = render(<WaitressScreen />);
    // Adjust the placeholder and button text to match your component
    const picker = getByTestId('table-picker');
    fireEvent(picker, 'valueChange', '12');
    fireEvent.press(getByText('Enter'));
    // Optionally, check if navigation or context was called
  });
});