import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { StripeProvider } from '@stripe/stripe-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Toast } from 'toastify-react-native';


export default function StripeWrapper({ children }: { children: React.ReactElement | React.ReactElement[] }) {
  const { accessToken } = useAuth();
  const api = useMemo(() => createAPIClient(), []);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await api.get('/payments/config');
        setPublishableKey(res.data.publishableKey);
      } catch (err: any) {
        const errorMessage = err.response?.data || err.message || 'Failed to fetch Stripe key';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch Stripe key',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
        });
      }
    };
    fetchKey();
  }, [api, accessToken]);

  if (!publishableKey) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#871919ff" />
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      {children}
    </StripeProvider>
  );
}
