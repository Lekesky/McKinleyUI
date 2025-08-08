import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', paddingTop: 20 ,marginBottom: 16, color: '#fff', marginTop: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 18 },
  quantity: { fontSize: 14, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: 'bold' },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 20,
  },
  actions: {
    marginBottom: 90,
    gap: 10,
  },
  orderList: {
      marginLeft: 13,
      marginRight: 13,
  },
});

export default styles;