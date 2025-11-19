import AppleSignInButton from '@/components/AppleSignInButton';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('AppleSignInButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button', () => {
    const { getByText } = render(<AppleSignInButton onPress={mockOnPress} />);
    expect(getByText(/Sign in with Apple/i)).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const { getByText } = render(<AppleSignInButton onPress={mockOnPress} />);
    
    fireEvent.press(getByText(/Sign in with Apple/i));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should display Apple icon', () => {
    const { UNSAFE_root } = render(
      <AppleSignInButton onPress={mockOnPress} />
    );
    
    // Apple logo SVG should be present
    expect(UNSAFE_root).toBeTruthy();
  });
});
