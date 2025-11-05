import CustomerCart from '@/components/ui/CustomerCart';
import WaitressCart from '@/components/ui/WaitressCart';
import ViewControl from '@/components/ViewSwitcher';
import { useAuth } from '@/context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useCart } from '../../context/CartContext';
import styles from '../../styles/Cart.styles';

const VIEWS = ["Customer Cart", "Waitress Cart"];

export default function Cart() {
    const { userRole } = useAuth();
    const { defaultView } = useLocalSearchParams<{ defaultView: string }>();
    const { getActiveCart } = useCart();
    const customerCart = getActiveCart("CUSTOMER");
    const waitressCart = getActiveCart("WAITRESS");
    
    const [selectedIndex, setSelectedIndex] = useState<number>(
      defaultView === 'waitress' ? 1 : 
      userRole === 'CUSTOMER' ? 0 : 1
    );

    const goBackHandler = () => { router.back() }

    return (
      <View style={styles.container}>

        {/* Header with Back Button and Title */} 
        <View style={styles.header}>
            <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
                <Icon source="arrow-left" size={24} color="#3c3c3cff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cart</Text>
        </View>

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
              containerStyle={{ alignSelf: "center", marginVertical: 20 }}
          />
        )}

        {/* Customer View*/}
        {selectedIndex === 0 && (
          customerCart.length === 0 ? (
            <View>
              <Text>Your cart is empty.</Text>
            </View>
          ) : (
            <CustomerCart customerCart={customerCart} />
          )
        )}

        {/* Waitress View */}
        { selectedIndex === 1 && (
          waitressCart.length === 0 ? (
            <View>
              <Text>Your cart is empty.</Text>
            </View>
          ) : (
            <WaitressCart waitressCart={waitressCart} />
          )
        )}

      </View>
    );
}


