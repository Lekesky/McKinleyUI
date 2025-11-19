import { useAuth } from "@/context/AuthContext";
import createAPIClient from "@/services/api";
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { useMemo, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

interface MobileStripeCheckoutProps {
    amount: number;
    customerCart: any[];
    onSuccess: () => void;
    onError: (error: string) => void;
    buttonStyle: any;
}

export default function StripeCheckout({ 
    amount, 
    customerCart, 
    onSuccess, 
    onError, 
    buttonStyle 
}: MobileStripeCheckoutProps) {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const [loading, setLoading] = useState(false);

    const placeOrder = async (paymentIntentId: string) => {
        const orderData = {
            userID: uid,
            orderItems: customerCart.map((item) => ({
                menuItemId: item.id,
                quantity: item.quantity
            })),
            paymentIntentId
        };
        
        try {
            const response = await api.post(`/orders`, orderData);
            return true;
        } catch (error: any) {
            let errorMessage = "Failed to place order. Try again later.";
            
            if (error.response?.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
            }
            
            console.error("Order failed:", errorMessage);
            onError(errorMessage);
            return false;
        }
    };

    const initializePaymentSheet = async () => {
        const stripeData = {
            customerId: uid,
            amount: Math.round(amount * 100), // Convert to cents
        };
        
        try {
            const resPaymentIntent = await api.post('/payments', stripeData);
            const { paymentIntentId, paymentIntent, ephemeralKey, customer } = resPaymentIntent.data;
            const resSetupIntent = await api.post('/payments/setup-intent', { customerId: customer });
            
            const { setupIntentClientSecret } = resSetupIntent.data;
            
            const { error } = await initPaymentSheet({
                merchantDisplayName: 'Mckinley Grill',
                customerId: customer,
                setupIntentClientSecret: setupIntentClientSecret,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                allowsDelayedPaymentMethods: false,
            });

            if (error) {
                return false;
            } else {
                return paymentIntentId;
            }
        } catch (err) {
            return false;
        }
    };

    const handleMobileCheckout = async () => {
        setLoading(true);
        
        const paymentIntentID = await initializePaymentSheet();
        
        if (paymentIntentID === false) {
            onError('Could not initialize payment.');
            setLoading(false);
            return;
        }

        const { error } = await presentPaymentSheet();

        if (error) {
            onError(error.message || 'Payment failed');
            setLoading(false);
        } else {
            const result = await placeOrder(paymentIntentID);
            if (result) {
                onSuccess();
            } else {
                onError('Payment succeeded but order placement failed');
            }
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity 
            onPress={handleMobileCheckout} 
            style={buttonStyle}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#ffffff" />
            ) : (
                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Proceed to Checkout
                </Text>
            )}
        </TouchableOpacity>
    );
}