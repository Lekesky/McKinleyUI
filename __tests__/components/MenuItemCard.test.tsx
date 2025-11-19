import { MenuItemCard } from '@/components/MenuItemCard';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('MenuItemCard', () => {
  const mockProps = {
    id: '1',
    name: 'Test Burger',
    description: 'Delicious test burger',
    price: '12.99',
    imageURL: 'https://example.com/burger.jpg',
    tags: ['Popular', 'New'],
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render menu item details correctly', () => {
    const { getByText } = render(<MenuItemCard {...mockProps} />);

    expect(getByText('Test Burger')).toBeTruthy();
    expect(getByText('Delicious test burger')).toBeTruthy();
    expect(getByText('$12.99')).toBeTruthy();
  });

  it('should render tags correctly', () => {
    const { getByText } = render(<MenuItemCard {...mockProps} />);

    expect(getByText('Popular')).toBeTruthy();
    expect(getByText('New')).toBeTruthy();
  });

  it('should call onPress with correct id when pressed', () => {
    const { getByText } = render(<MenuItemCard {...mockProps} />);
    
    const card = getByText('Test Burger').parent?.parent?.parent;
    if (card) {
      fireEvent.press(card);
      expect(mockProps.onPress).toHaveBeenCalledWith('1');
    }
  });

  it('should render with empty tags array', () => {
    const propsWithNoTags = { ...mockProps, tags: [] };
    const { queryByText } = render(<MenuItemCard {...propsWithNoTags} />);

    expect(queryByText('Popular')).toBeNull();
    expect(queryByText('New')).toBeNull();
  });

  it('should render image with correct URI', () => {
    const { UNSAFE_getByType } = render(<MenuItemCard {...mockProps} />);
    const images = UNSAFE_getByType('Image' as any);
    
    expect(images.props.source).toEqual({ uri: mockProps.imageURL });
  });
});
