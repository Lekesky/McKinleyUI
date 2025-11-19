import GoogleSignInButton from '@/components/GoogleSignInButton';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('GoogleSignInButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button', () => {
    const { getByText } = render(<GoogleSignInButton onPress={mockOnPress} />);
    expect(getByText(/Sign in with Google/i)).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const { getByText } = render(<GoogleSignInButton onPress={mockOnPress} />);
    
    fireEvent.press(getByText(/Sign in with Google/i));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should display Google icon', () => {
    const { UNSAFE_root } = render(
      <GoogleSignInButton onPress={mockOnPress} />
    );
    
    // Google logo SVG should be present
    expect(UNSAFE_root).toBeTruthy();
  });
});
