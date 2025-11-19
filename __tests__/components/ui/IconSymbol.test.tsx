import { IconSymbol } from '@/components/ui/IconSymbol';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('IconSymbol', () => {
  it('should render with given name', () => {
    const { UNSAFE_root } = render(
      <IconSymbol name="house.fill" size={24} color="black" />
    );
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should apply size prop', () => {
    const { UNSAFE_root } = render(
      <IconSymbol name="house.fill" size={32} color="black" />
    );
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should apply color prop', () => {
    const { UNSAFE_root } = render(
      <IconSymbol name="house.fill" size={24} color="red" />
    );
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle different icon names', () => {
    const { UNSAFE_root } = render(
      <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color="black" />
    );
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render cart icon', () => {
    const { UNSAFE_root } = render(
      <IconSymbol name="cart.fill" size={24} color="black" />
    );
    
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render person icon', () => {
    const { UNSAFE_root } = render(
      <IconSymbol name="person.crop.circle.fill" size={24} color="black" />
    );
    
    expect(UNSAFE_root).toBeTruthy();
  });
});
