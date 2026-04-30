import AdminAnalytics from '@/components/ui/AdminAnalytics';
import AdminMembers from '@/components/ui/AdminMembers';
import AdminMenu from '@/components/ui/AdminMenu';
import AdminOrderHistory from '@/components/ui/AdminOrderHistory';
import ViewControl from '@/components/ViewSwitcher';
import { useMobileTabBar } from '@/context/TabBarContext';
import createAPIClient from '@/services/api';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Icon, Portal, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { useCart } from '@/context/CartContext';
import styles from '../styles/Admin.styles';

export default function Admin() {
  const api = useMemo(() => createAPIClient(), []);
  const { hideTabBar, showTabBar } = useMobileTabBar();
  const insets = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // const [isPaused, setIsPaused] = useState<boolean>(false);
  const { isCartPaused: isPaused } = useCart();
  const [pauseDialogVisible, setPauseDialogVisible] = useState(false);
  const [pauseModalVisible, setPauseModalVisible] = useState(false);
  const hidePauseDialog = () => {
    setPauseModalVisible(!pauseModalVisible);
    setPauseDialogVisible(false);
    showTabBar();
  };
  const showPauseDialog = () => {
    setPauseModalVisible(!pauseModalVisible);
    setPauseDialogVisible(true);
    hideTabBar();
  };
  // Simple search states for tabs
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Menu items are still passed down to menu & order-history components
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const handlePauseOrders = () => {
    hidePauseDialog();
    api.post('/orders/pause')
      .then((res) => {
        if(JSON.stringify(res.data).includes('false')){
          Toast.success('Orders have been resumed successfully.');
        } else if(JSON.stringify(res.data).includes('true')) {
          Toast.success('Orders have been paused successfully.');
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data || error.message || 'Failed to pause orders';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to pause orders',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
      });
    });
  }

  useEffect(() => {
    let mounted = true;
    const param = { page: 0, size: 200 };
    api.get('/menu', { params: param })
      .then((res) => {
        if (!mounted) return;
        setMenuItems(res?.data?.content || []);
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch menu items',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
      });
      });
    return () => {
      mounted = false;
    };
  }, [api]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={{ backgroundColor: '#ffffffff', zIndex: 10 }}>

        {Platform.OS !== 'web' ? ( 
          <>
              <Portal>
                  <Dialog visible={pauseDialogVisible} onDismiss={hidePauseDialog}>
                      <Dialog.Title>{isPaused ? "Confirm Resume?" : "Confirm Pause?"}</Dialog.Title>
                      <Dialog.Content><Text variant="bodyMedium">Are you sure you want to {isPaused ? "resume" : "pause"} orders?</Text></Dialog.Content>
                      <Dialog.Actions>
                          <Button onPress={hidePauseDialog}>Cancel</Button>
                          <Button onPress={handlePauseOrders}>{isPaused ? "Resume" : "Pause"}</Button>
                      </Dialog.Actions>
                  </Dialog>
              </Portal>
          </>
      ) : (
          <>
              <Modal
                  transparent={true}
                  visible={pauseModalVisible}
                  onRequestClose={() => {
                      setPauseModalVisible(!pauseModalVisible);
              }}>
                  <View style={styles.webModalOverlay}>
                      <View style={styles.centeredModelView}>
                          <View style={styles.modalView}>
                          <Text style={styles.modalTextHeader}>{isPaused ? "Confirm Resume?" : "Confirm Pause?"}</Text>
                          <Text style={styles.modalText}>Are you sure you want to {isPaused ? "resume" : "pause"} orders?</Text>
                          <View style={styles.modalButtonContainer}>
                              {/* Pause and Cancel Buttons */}
                              <TouchableOpacity
                                  style={[styles.modalButton, styles.modalButtonCancel]}
                                  onPress={() => setPauseModalVisible(!pauseModalVisible)}>
                                  <Text style={styles.modalTextStyle}>Cancel</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                  style={[styles.modalButton, styles.modalButtonPause]}
                                  onPress={handlePauseOrders}>
                                  <Text style={styles.modalTextStyle}>{isPaused ? "Resume" : "Pause"}</Text>
                              </TouchableOpacity>
                          </View>
                          </View>
                      </View>
                  </View>
              </Modal>
          </>
      )}

        {Platform.OS !== 'web' && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon source="arrow-left" size={24} color="#3c3c3cff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
          </View>
        )}

        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20, width: '100%', paddingHorizontal: 10 }}>
          <ViewControl
            values={["Analytics", "Members", "Menu", "Order History"]}
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            width={Platform.OS === 'web' ? Math.min(600, typeof window !== 'undefined' ? window.innerWidth - 40 : 600) : 410}
            height={40}
            activeColor="#ffffff"
            inactiveColor="#e8e8e8ff"
            activeTextColor="#000"
            textColor="#333"
            borderRadius={20}
            containerStyle={{ alignSelf: 'center', marginVertical: 20, marginHorizontal: 10 }}
          />
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#e8e8e8ff', 
              gap: 5,
              paddingHorizontal: 15,
              height: 40, 
              borderRadius: 20, 
              justifyContent: 'center', 
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => {
              showPauseDialog();
            }}
          >
            <Icon source="power" size={20} color="#871919ff" />
            <Text style={{ color: '#000000ff' }}>{isPaused ? "Resume Orders" : "Pause Orders"}</Text>
          </TouchableOpacity>
        </View>

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
