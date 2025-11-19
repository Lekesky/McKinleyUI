import TabBarBackground, { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('TabBarBackground', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = render(<TabBarBackground />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render as View', () => {
    const { UNSAFE_getByType } = render(<TabBarBackground />);
    
    const view = UNSAFE_getByType('View' as any);
    expect(view).toBeTruthy();
  });
});

describe('useBottomTabOverflow', () => {
  it('should return 0', () => {
    const overflow = useBottomTabOverflow();
    expect(overflow).toBe(0);
  });
});
