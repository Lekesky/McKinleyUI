import CustomerOrders from '@/components/ui/CustomerOrders';
import KitchenOrders from '@/components/ui/KitchenOrders';
import ViewControl from '@/components/ViewSwitcher';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import styles from '../../styles/Order.styles';

const VIEWS = ["Customer", "Kitchen"];

export default function OrderScreen() {
    const { userRole } = useAuth();
    const [selectedIndex, setSelectedIndex] = useState<number>(userRole === 'CUSTOMER' ? 0 : 1);
    const goBackHandler = () => { router.back() }

    return (
        <View style={styles.container}>

            {Platform.OS !== 'web' && (
                <>
                    {/* Header with Back Button and Title */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                            <Icon source="arrow-left" size={24} color="#3c3c3cff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Orders</Text>
                    </View>
                </>
            )}
           

            {/* View Switcher */}
            {userRole && (userRole === 'WAITRESS' || userRole === 'ADMIN' || userRole === 'CHEF') && (
                <ViewControl
                    values={VIEWS}
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                    width={300}
                    height={40}
                    activeColor="#ffffff"
                    inactiveColor="#d3d3d3"
                    activeTextColor="#000"
                    textColor="#333"
                    borderRadius={20}
                    containerStyle={styles.viewController}
                />
            )}

            {/*Customer View*/}
            {selectedIndex === 0 && (
                <CustomerOrders />
            )}

            {/*Kitchen View*/}
            {selectedIndex === 1 && (
                <KitchenOrders />
            )}
        </View>
    );
}



