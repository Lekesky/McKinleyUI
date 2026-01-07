import { useAuth } from '@/context/AuthContext';
import { useMobileTabBar } from '@/context/TabBarContext';
import createAPIClient from '@/services/api';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import styles from '../../styles/Notification.styles';



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
  const { hideTabBar, showTabBar } = useMobileTabBar();
  const api = useMemo(() => createAPIClient(), []);
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('Unread');
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10; // Small sample size for testing pagination
  const [bottomSheetIsOpen, setBottomSheetIsOpen] = useState(false);
  const [webModalVisible, setWebModalVisible] = useState(false);
  
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
  


  const fetchNotifications = useCallback(async (page = 0) => {
    await api.get(`/notifications/${uid}`, {
      params: {
        page,
        size: PAGE_SIZE
      }
    })
      .then((res) => {
        
        // Handle initial load or refresh
        if (page === 0) {
          setNotifications(res.data.content || []);
        } else {
          // Append new items for infinite scroll
          setNotifications(prev => [...prev, ...(res.data.content || [])]);
        }
        
        setHasMore(!res.data.last);
        setPageNumber(res.data.number);
      })
      .catch((err) => {
        const errorMessage = err.response?.data || err.message || 'Failed to fetch notifications';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch notifications',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
        });
      })
      .finally(() => {
        if (page === 0) {
          setLoading(false);
        }
      });
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

  const handleNotificationPress = (notification: Notification) => {
      api.patch(`/notifications/read/${notification.id}`)
        .then(() => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notification.id ? { ...n, readStatus: true } : n))
          );
        })
        .catch(() => {
          // Failed to mark notification as read
        });
  };
  
  const handleSendNotification = () => {
    if (Platform.OS === 'web') {
      setWebModalVisible(true);
    } else {
      if(bottomSheetIsOpen) {
        closeBottomSheet();
        return;
      }
      openBottomSheet(0);
    }
  };
  
  const submitNotification = () => {
    // Reset form and close bottom sheet
    setNotificationTitle('');
    setNotificationMessage('');

    if(Platform.OS !== 'web'){
      closeBottomSheet();
    }else{
      setWebModalVisible(false);
    }
    

    const data = {
      authorId: uid,
      title: notificationTitle,
      message: notificationMessage
    }
    
    api.post('/notifications/sendPSA', data)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Notification sent successfully',
          position: 'top',
          backgroundColor: '#4CAF50',
          textColor: '#FFFFFF',
        });
        fetchNotifications(0);
      })
      .catch((err) => {
        const errorMessage = err.response?.data || err.message || 'Failed to send notification';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to send notification',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
        });
      });
  };

  // Filter categories
  const notificationFilters = ['Unread', 'Read', 'All' ];
  
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
      {/* Main content container */}
      <View style={[styles.container, { maxHeight: '100%', paddingTop: insets.top }]}>
        {Platform.OS !== 'web' && (
          <>
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
          </>
        )}
        
        

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
          
          {/* Web Add Button - positioned naturally after filters */}
          {Platform.OS === 'web' && userRole === 'ADMIN' && (
            <TouchableOpacity onPress={handleSendNotification} style={styles.webAddButton}>
              <Icon source="plus" size={20} color="#FFFFFF" />
              <Text style={styles.webAddButtonText}>Add Notification</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchNotifications(0).finally(() => setRefreshing(false));
              }}
              colors={["#871919ff"]} 
              tintColor="#871919ff" 
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            
            if (isCloseToBottom && !refreshing && hasMore && !loadingMore) {
              setLoadingMore(true);
              fetchNotifications(pageNumber + 1).finally(() => setLoadingMore(false));
            }
          }}
          scrollEventThrottle={16}
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
          
          {/* Loading indicator for infinite scroll */}
          {loadingMore && (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#871919ff" />
              <Text style={styles.loadingMoreText}>Loading more...</Text>
            </View>
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

      {/* Web Modal for sending notifications */}
      {Platform.OS === 'web' && (
        <Modal
          visible={webModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setWebModalVisible(false)}
        >
          <View style={styles.webModalOverlay}>
            <View style={styles.webModalContent}>
              <Text style={styles.webModalTitle}>Send New Notification</Text>
              
              <View style={styles.webFormGroup}>
                <TextInput
                  style={styles.webInput}
                  placeholder="Title"
                  value={notificationTitle}
                  onChangeText={setNotificationTitle}
                  placeholderTextColor="#666"
                />
              </View>
              
              <View style={styles.webFormGroup}>
                <TextInput
                  style={[styles.webInput, styles.webTextArea]}
                  placeholder="Message"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={notificationMessage}
                  onChangeText={setNotificationMessage}
                  placeholderTextColor="#666"
                />
              </View>
              
              <View style={styles.webButtonContainer}>
                <TouchableOpacity 
                  style={styles.webCancelButton} 
                  onPress={() => setWebModalVisible(false)}
                >
                  <Text style={styles.webCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.webSubmitButton} 
                  onPress={submitNotification}
                >
                  <Text style={styles.webSubmitButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
}





