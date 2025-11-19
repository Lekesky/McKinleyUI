import Index from '@/app/index';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Platform } from 'react-native';

describe('Index', () => {
  it('should redirect to Home on web', () => {
    Platform.OS = 'web';
    const { UNSAFE_getByType } = render(<Index />);
    const redirect = UNSAFE_getByType('Redirect');
    expect(redirect.props.href).toBe('/(tabs)/Home');
  });

  it('should redirect to Intro on mobile', () => {
    Platform.OS = 'ios';
    const { UNSAFE_getByType } = render(<Index />);
    const redirect = UNSAFE_getByType('Redirect');
    expect(redirect.props.href).toBe('/Intro');
  });

  it('should render correctly', () => {
    const { toJSON } = render(<Index />);
    expect(toJSON()).toBeTruthy();
  });
});
