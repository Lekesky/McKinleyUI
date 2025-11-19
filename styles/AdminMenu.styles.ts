import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  menuItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isWeb ? 'flex-start' : 'center',
    paddingHorizontal: isWeb ? 8 : 16,
  },
  cardContainer: {
    flexBasis: isWeb ? '30%' : '100%',
    maxWidth: isWeb ? '30%' : '100%',
    flexGrow: 0,
    marginVertical: isWeb ? 10 : 6,
    marginHorizontal: isWeb ? 12 : 0,
  },
  menuItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  menuItemImage: {
    width: '100%',
    height: 120,
  },
  contentContainer: {
    padding: 12,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  menuItemPrice: {
    fontSize: 16,
    color: '#871919ff',
    fontWeight: 'bold',
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