import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  menuItemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItemPrice: {
    fontSize: 16,
    color: '#871919ff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  menuItemImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#871919ff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    padding: 15,
    textAlign: 'center',
    color: '#7e7d7dff',
    fontFamily: 'Helvetica',
  },
});

export default styles;