import { StyleSheet } from 'react-native';
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

export default styles;