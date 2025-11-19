import React from 'react';

// For web, we don't need a global Stripe wrapper
// Each checkout component will initialize its own Elements provider with clientSecret
export default function StripeWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
