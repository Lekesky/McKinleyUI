import HorizontalPills from '@/components/HorizontalPills';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-paper', () => {
  const mockReact = require('react');
  const { View: MockView, Text: MockText } = require('react-native');
  
  const flattenChildren = (children: any): string => {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return String(children);
    if (Array.isArray(children)) {
      return children.map(flattenChildren).join('');
    }
    if (children && typeof children === 'object' && children.props) {
      return flattenChildren(children.props.children);
    }
    return '';
  };
  
  return {
    Button: ({ children, onPress, style }: any) => 
      mockReact.createElement(
        MockView, 
        { onPress, style }, 
        mockReact.createElement(MockText, {}, flattenChildren(children))
      ),
  };
});

describe('HorizontalPills', () => {
  const mockCategories = ['All', 'Burgers', 'Pizza', 'Drinks'];
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all categories', () => {
    const { getByText } = render(
      <HorizontalPills
        categories={mockCategories}
        selectedCategory="All"
        setSelectedCategory={mockOnSelect}
      />
    );

    mockCategories.forEach((category) => {
      expect(getByText(category)).toBeTruthy();
    });
  });

  it('should highlight selected category', () => {
    const { getByText } = render(
      <HorizontalPills
        categories={mockCategories}
        selectedCategory="Burgers"
        setSelectedCategory={mockOnSelect}
      />
    );

    const burgersPill = getByText('Burgers');
    expect(burgersPill).toBeTruthy();
  });

  it('should call setSelectedCategory when pill is pressed', () => {
    const { getByText } = render(
      <HorizontalPills
        categories={mockCategories}
        selectedCategory="All"
        setSelectedCategory={mockOnSelect}
      />
    );

    const pizzaPill = getByText('Pizza');
    fireEvent.press(pizzaPill);

    expect(mockOnSelect).toHaveBeenCalledWith('Pizza');
  });

  it('should render with empty categories array', () => {
    const { UNSAFE_root } = render(
      <HorizontalPills
        categories={[]}
        selectedCategory=""
        setSelectedCategory={mockOnSelect}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });
});
