import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';
import auth from '../../services/firebaseConfig';

export default function Notification() {
  type Notification = {
    id: string;
    userId: string;
    title: string;
    message: string;
    timestamp: string;
    readStatus: boolean;
  }

  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);


  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    fetchNotifications().finally(() => setRefreshing(false));
  };

  const fetchNotifications = async () => {
    try {
      const uid = auth?.currentUser?.uid;
      if (!uid) return;

      const res = await api.get(`/notifications/${uid}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {fetchNotifications();}, []);

  const formatDate = (isoString: string | number | Date) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      const uid = auth?.currentUser?.uid;
      if (!uid) return;

      await api.post(`/notifications/${uid}/read`, { notificationId: notification.id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, readStatus: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🔔 Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={40}/>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNotificationPress(item)} activeOpacity={0.7}>
            <View style={styles.card} >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  message: { fontSize: 14, marginTop: 4 },
  timestamp: { fontSize: 12, color: '#666', marginTop: 6 },
});
