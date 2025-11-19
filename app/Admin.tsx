import AdminAnalytics from '@/components/ui/AdminAnalytics';
import AdminMembers from '@/components/ui/AdminMembers';
import AdminMenu from '@/components/ui/AdminMenu';
import AdminOrderHistory from '@/components/ui/AdminOrderHistory';
import ViewControl from '@/components/ViewSwitcher';
import createAPIClient from '@/services/api';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
import styles from '../styles/Admin.styles';

export default function Admin() {
  const api = useMemo(() => createAPIClient(), []);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Simple search states for tabs
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Menu items are still passed down to menu & order-history components
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    api
      .get('menu')
      .then((resp) => {
        if (!mounted) return;
        setMenuItems(resp?.data?.content || []);
      })
      .catch(() => {
        // Silent error
      });
    return () => {
      mounted = false;
    };
  }, [api]);

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: '#ffffffff', zIndex: 10 }}>

        {Platform.OS !== 'web' && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon source="arrow-left" size={24} color="#3c3c3cff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
          </View>
        )}

        <ViewControl
          values={["Analytics", "Members", "Menu", "Order History"]}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
          width={Platform.OS === 'web' ? 600 : 410}
          height={40}
          activeColor="#ffffff"
          inactiveColor="#e8e8e8ff"
          activeTextColor="#000"
          textColor="#333"
          borderRadius={20}
          containerStyle={{ alignSelf: 'center', marginVertical: 20, marginHorizontal: 10 }}
        />

        {selectedIndex === 1 && (
          <View style={{ paddingBottom: 10 }}>
            <Text style={styles.subtitle}>Search Users:</Text>
            <TextInput
              label="Search for user"
              value={userSearch}
              onChangeText={setUserSearch}
              mode="outlined"
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
            />
          </View>
        )}

        {selectedIndex === 2 && (
          <View style={{ paddingBottom: 10 }}>
            <Text style={styles.subtitle}>Menu Items:</Text>
            <TextInput
              label="Search for product"
              value={productSearch}
              onChangeText={setProductSearch}
              mode="outlined"
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              placeholder="Search by name"
            />
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() =>
                router.push({ pathname: '/EditProduct', params: { product: JSON.stringify({ id: '', name: '', description: '', price: 0, imageURL: '' }) } })
              }
            >
              <Text style={styles.buttonText}>Add New Menu Item</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedIndex === 3 && (
          <View style={{ paddingBottom: 10 }}>
            <Text style={styles.subtitle}>Order History:</Text>
            <TextInput
              label="Search orders"
              value={orderSearch}
              onChangeText={setOrderSearch}
              mode="outlined"
              style={styles.textInput}
              outlineStyle={styles.textInputOutline}
              placeholder="Search by customer, waitress, or order ID"
            />
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        {selectedIndex === 0 && <AdminAnalytics />}
        {selectedIndex === 1 && <AdminMembers userSearch={userSearch} />}
        {selectedIndex === 2 && <AdminMenu productSearch={productSearch} menuItems={menuItems} />}
        {selectedIndex === 3 && <AdminOrderHistory orderSearch={orderSearch} menuItems={menuItems} />}
      </View>
    </View>
  );
}