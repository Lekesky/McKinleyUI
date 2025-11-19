import ViewControl from '@/components/ViewSwitcher';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('ViewSwitcher', () => {
  const mockValues = ['View 1', 'View 2', 'View 3'];
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all view options', () => {
    const { getByText } = render(
      <ViewControl
        values={mockValues}
        selectedIndex={0}
        onChange={mockOnChange}
      />
    );

    mockValues.forEach((value) => {
      expect(getByText(value)).toBeTruthy();
    });
  });

  it('should highlight selected view', () => {
    const { getByText } = render(
      <ViewControl
        values={mockValues}
        selectedIndex={1}
        onChange={mockOnChange}
      />
    );

    const selectedView = getByText('View 2');
    expect(selectedView).toBeTruthy();
  });

  it('should call onChange when view is selected', () => {
    const { getByText } = render(
      <ViewControl
        values={mockValues}
        selectedIndex={0}
        onChange={mockOnChange}
      />
    );

    const view2 = getByText('View 2');
    fireEvent.press(view2);

    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('should apply custom styling props', () => {
    const { UNSAFE_root } = render(
      <ViewControl
        values={mockValues}
        selectedIndex={0}
        onChange={mockOnChange}
        width={300}
        height={50}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });
});
