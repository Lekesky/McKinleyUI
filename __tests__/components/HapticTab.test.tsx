import { HapticTab } from '@/components/HapticTab';
import { fireEvent, render } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text } from 'react-native';

jest.mock('expo-haptics');

describe('HapticTab', () => {
  const mockOnPressIn = jest.fn();
  const mockProps = {
    onPressIn: mockOnPressIn,
    children: <Text>Tab Content</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render tab content', () => {
    const { getByText } = render(<HapticTab {...mockProps} />);
    expect(getByText('Tab Content')).toBeTruthy();
  });

  it('should call haptic feedback on iOS when pressed', () => {
    process.env.EXPO_OS = 'ios';
    
    const { getByText } = render(<HapticTab {...mockProps} />);
    const tab = getByText('Tab Content').parent;

    if (tab) {
      fireEvent(tab, 'pressIn');
      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    }
  });

  it('should call onPressIn callback', () => {
    const { getByText } = render(<HapticTab {...mockProps} />);
    const tab = getByText('Tab Content').parent;

    if (tab) {
      fireEvent(tab, 'pressIn');
      expect(mockOnPressIn).toHaveBeenCalled();
    }
  });

  it('should not call haptic on non-iOS platforms', () => {
    process.env.EXPO_OS = 'android';
    
    const { getByText } = render(<HapticTab {...mockProps} />);
    const tab = getByText('Tab Content').parent;

    if (tab) {
      fireEvent(tab, 'pressIn');
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    }
  });
});
