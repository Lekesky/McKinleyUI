import StripeWrapper from '@/components/StripeWrapper';
import { useAuth } from '@/context/AuthContext';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/context/AuthContext');
jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({ children }: any) => <div>{children}</div>,
  CardField: ({ onCardChange }: any) => (
    <input onChange={(e) => onCardChange({ complete: true })} />
  ),
  useStripe: () => ({
    confirmPayment: jest.fn().mockResolvedValue({ paymentIntent: { id: 'pi_123' } }),
  }),
}));

describe('StripeWrapper', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      uid: 'user-123',
      accessToken: 'token',
      refreshToken: 'refresh',
    });
  });

  it('should render stripe provider', () => {
    const { UNSAFE_root } = render(
      <StripeWrapper
        amount={25.99}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render card field', () => {
    const { UNSAFE_getByType } = render(
      <StripeWrapper
        amount={25.99}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(UNSAFE_getByType('CardField' as any)).toBeTruthy();
  });

  it('should handle card input change', () => {
    const { UNSAFE_getByType } = render(
      <StripeWrapper
        amount={25.99}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    const cardField = UNSAFE_getByType('input' as any);
    fireEvent.change(cardField, { target: { value: '4242424242424242' } });

    expect(cardField).toBeTruthy();
  });

  it('should display amount', () => {
    const { getByText } = render(
      <StripeWrapper
        amount={25.99}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(getByText(/25\.99/)).toBeTruthy();
  });
});
