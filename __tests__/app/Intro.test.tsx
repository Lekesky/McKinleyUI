import Intro from '@/app/Intro';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('Intro Screen', () => {
  it('should render intro screen', () => {
    const { getByText } = render(<Intro />);

    expect(getByText(/Welcome/i)).toBeTruthy();
  });

  it('should display continue button', () => {
    const { getByText } = render(<Intro />);

    expect(getByText('Continue')).toBeTruthy();
    expect(getByText('Already have an account? Sign In')).toBeTruthy();
  });

  it('should render app description', () => {
    const { getByText } = render(<Intro />);

    expect(getByText(/Order breakfast, lunch, and dinner/i)).toBeTruthy();
  });
});
