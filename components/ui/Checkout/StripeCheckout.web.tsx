import { useAuth } from "@/context/AuthContext";
import createAPIClient from "@/services/api";
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

interface WebStripeCheckoutProps {
    customerCart: any[];
    onSuccess: () => void;
    onError: (error: string) => void;
    buttonStyle: any;
    onAmountsCalculated?: (amounts: { subTotal: number; taxAmount: number; total: number }) => void;
}

function CheckoutForm({ 
    customerCart, 
    onSuccess, 
    onError, 
    buttonStyle
}: WebStripeCheckoutProps & { clientSecret: string }) {
    const stripe = useStripe();
    const elements = useElements();
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

    const handleWebCheckout = async () => {
        if (!stripe || !elements) {
            onError('Stripe is not loaded yet. Please wait a moment.');
            return;
        }

        setLoading(true);

        try {
            // Confirm payment with Stripe
            const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin,
                },
                redirect: 'if_required',
            });

            if (error) {
                onError(error.message || 'Payment failed');
                setLoading(false);
                return;
            }

            if (confirmedPaymentIntent && confirmedPaymentIntent.status === 'succeeded') {
                const orderResult = await placeOrder(confirmedPaymentIntent.id);
                if (orderResult) {
                    onSuccess();
                } else {
                    onError('Payment succeeded but order placement failed');
                }
            } else {
                onError('Payment was not completed');
            }
        } catch (error: any) {
            console.error('Web checkout error:', error);
            onError(error.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ gap: 16 }}>
            <View style={{ padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff' }}>
                <PaymentElement />
            </View>
            <TouchableOpacity 
                onPress={handleWebCheckout} 
                style={buttonStyle}
                disabled={loading || !stripe || !elements}
            >
                {loading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Proceed to Checkout
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

export default function StripeCheckout({ 
    customerCart, 
    onSuccess, 
    onError, 
    buttonStyle,
    onAmountsCalculated
}: WebStripeCheckoutProps) {
    const { uid } = useAuth();
    const api = useMemo(() => createAPIClient(), []);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [taxAmount, setTaxAmount] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                if (!uid) return;

                // Fetch publishable key
                const configRes = await api.get('/payments/config');
                const publishableKey = configRes.data.publishableKey;
                setStripePromise(loadStripe(publishableKey));

                // Create payment intent
                const stripeData = {
                    customerId: uid,
                    orderItems: customerCart.map((item) => ({
                        menuItemId: item.id, 
                        quantity: item.quantity
                    })),
                };

                const response = await api.post('/payments', stripeData);
                const { paymentIntent, subtotal, taxAmount, totalAmount } = response.data;
                setSubTotal(subtotal);
                setTaxAmount(taxAmount);
                setTotal(totalAmount);

                if (onAmountsCalculated) {
                    onAmountsCalculated({
                        subTotal: subtotal / 100,
                        taxAmount: taxAmount / 100,
                        total: totalAmount / 100
                    });
                }

                setClientSecret(paymentIntent);
            } catch (error: any) {
                console.error('Error initializing payment:', error);
                onError('Failed to initialize payment');
            }
        };

        initializePayment();
    }, [uid, api, onError, customerCart, onAmountsCalculated]);

    if (!clientSecret || !stripePromise) {
        return (
            <View style={{ padding: 16, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#871919ff" />
                <Text style={{ marginTop: 8, color: '#333' }}>Initializing payment...</Text>
            </View>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
                customerCart={customerCart}
                onSuccess={onSuccess}
                onError={onError}
                buttonStyle={buttonStyle}
                clientSecret={clientSecret}
            />
        </Elements>
    );
}