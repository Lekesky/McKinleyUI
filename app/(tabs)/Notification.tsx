import { useAuth } from '@/context/AuthContext';
import { useTabBar } from '@/context/TabBarContext';
import createAPIClient from '@/services/api';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-paper';



type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  readStatus: boolean;
}

export default function NotificationScreen() {
  const { uid, userRole } = useAuth();
  const { hideTabBar, showTabBar } = useTabBar();
  const api = useMemo(() => createAPIClient(), []);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  
  // Bottom sheet configuration
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);
  
  // Form state
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const openBottomSheet = useCallback((index: number) => {
    // Hide tab bar first before opening bottom sheet
    hideTabBar();
    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(index);
      setBottomSheetIsOpen(true);
    }, 100);
  }, [hideTabBar]);
  
  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setBottomSheetIsOpen(false);
    // Small delay to ensure proper sequence
    setTimeout(() => {
      showTabBar();
    }, 100);
  }, [showTabBar]);

  const goBackHandler = () => { router.back() }
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  };

  const fetchNotifications = useCallback(async () => {
      api.get(`/notifications/${uid}`)
        .then((res) => {
          setNotifications(res.data)
        })
        .catch((err) => {
          console.error('Error fetching notifications:', err);
        })
        .finally(() => setLoading(false));
  }, [api, uid]);

  useEffect(() => {fetchNotifications();}, [fetchNotifications]);
  
  // Handle tab bar visibility based on bottom sheet state
  useEffect(() => {
    // Update tab bar visibility whenever bottom sheet state changes
    if (bottomSheetIsOpen) {
      hideTabBar();
    } else {
      showTabBar();
    }
  }, [bottomSheetIsOpen, hideTabBar, showTabBar]);
  
  // Ensure tab bar is shown when component mounts and unmounts
  useEffect(() => {
    // Show tab bar when component mounts
    showTabBar();
    
    // Ensure tab bar is shown when component unmounts
    return () => {
      showTabBar();
    };
  }, [showTabBar]);

  const formatDate = (isoString: string | number | Date) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const handleNotificationPress = async (notification: Notification) => {
      api.patch(`/notifications/read/${notification.id}`)
        .then(() => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notification.id ? { ...n, readStatus: true } : n))
          );
          console.log(`Notification ${notification.id} marked as read.`);
        })
      .catch((err) => {
        console.error('Failed to mark notification as read:', err);
      });
  };
  
  const handleSendNotification = () => {
    if(bottomSheetIsOpen) {
      closeBottomSheet();
      return;
    }
    openBottomSheet(0);
  };
  
  const submitNotification = () => {
    console.log('Sending notification:', { title: notificationTitle, message: notificationMessage });
    // Reset form and close bottom sheet
    setNotificationTitle('');
    setNotificationMessage('');
    closeBottomSheet();
    // TODO: Implement actual sending of notification
  };

  // Filter categories
  const notificationFilters = ['All', 'Read', 'Unread'];
  
  // Filter notifications based on selected filter
  const filteredNotifications = useMemo(() => {
    if (selectedFilter === 'All') return notifications;
    if (selectedFilter === 'Read') return notifications.filter(note => note.readStatus);
    if (selectedFilter === 'Unread') return notifications.filter(note => !note.readStatus);
    return notifications;
  }, [notifications, selectedFilter]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#871919ff" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Darkened overlay when bottom sheet is open */}
      {/* {bottomSheetIsOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={closeBottomSheet}
        />
      )}
       */}
      {/* Main content container */}
      <View style={styles.container}>
        {/* Header with Back Button and Title */} 
        <View style={styles.header}>
          <TouchableOpacity onPress={goBackHandler} style={styles.backButton}>
            <Icon source="arrow-left" size={24} color="#3c3c3cff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {userRole === 'ADMIN' && (
            <TouchableOpacity onPress={handleSendNotification} style={styles.sendButton}>
              <Icon source="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs - Similar to Order screen */}
        <View style={styles.filterContainer}>
          {notificationFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === filter && styles.activeFilterTabText
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#871919ff"]} 
              tintColor="#871919ff" 
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon source="bell-off-outline" size={60} color="#cccccc" />
              <Text style={styles.emptyMessage}>No notifications found</Text>
            </View>
          ) : (
            filteredNotifications.map(item => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => handleNotificationPress(item)} 
                activeOpacity={0.7}
              >
                <View style={[
                  styles.notificationCard,
                  !item.readStatus && styles.unreadCard
                ]}>
                  {!item.readStatus && <View style={styles.unreadIndicator} />}
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationMessage}>{item.message}</Text>
                  <Text style={styles.notificationTimestamp}>{formatDate(item.timestamp)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
      
      {/* Bottom Sheet for sending notifications - positioned at the end so it's on top */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#999', width: 50 }}
        backgroundStyle={{ backgroundColor: '#fff' }}
        style={styles.bottomSheet}
        onClose={closeBottomSheet}
        onChange={(index) => {
          if (index === -1) {
            setBottomSheetIsOpen(false);
            showTabBar();
          } else {
            setBottomSheetIsOpen(true);
            hideTabBar();
          }
        }}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Send New Notification</Text>
          
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={notificationTitle}
              onChangeText={setNotificationTitle}
              placeholderTextColor="#666"
            />
          </View>
          
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Message"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={notificationMessage}
              onChangeText={setNotificationMessage}
              placeholderTextColor="#666"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={closeBottomSheet}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={submitNotification}
            >
              <Text style={styles.submitButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#ffffffff' 
  },
  header: {
    marginTop: 30,
    marginBottom: "5%",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  // Overlay for darkening the background when sheet is open
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  // Bottom Sheet Styles
  bottomSheet: {
    zIndex: 2,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    paddingBottom: "25%",
  },
  bottomSheetTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#871919ff',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#e8e8e8ff',
    borderRadius: 30,
    padding: 15,
    fontSize: 16,
    height: 58,
    marginBottom: 15,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    gap: 15,
  },
  submitButton: {
    backgroundColor: '#871919ff',
    height: 58, 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e8e8e8ff',
    height: 58, 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    color: '#871919ff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  backButton: { 
    backgroundColor: '#e8e8e8ff', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendButton: {
    backgroundColor: '#871919ff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
    gap: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 70,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#871919ff',
  },
  filterTabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  unreadCard: {
    backgroundColor: '#fff9f9',
    borderLeftWidth: 3,
    borderLeftColor: '#871919ff',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    backgroundColor: '#871919ff',
    borderRadius: 4,
  },
  notificationTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#333333',
  },
  notificationMessage: { 
    fontSize: 14, 
    marginTop: 4,
    color: '#555555',
  },
  notificationTimestamp: { 
    fontSize: 12, 
    color: '#888888', 
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyMessage: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#7e7d7dff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  }
})


