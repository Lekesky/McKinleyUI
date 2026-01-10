import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
    width: '100%',
  },
  menuItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isWeb ? 'flex-start' : 'center',
    paddingHorizontal: isWeb ? 8 : 16,
    width: '100%',
    ...(isWeb && {
      '@media (max-width: 1024px)': {
        justifyContent: 'center',
      },
      '@media (max-width: 768px)': {
        paddingHorizontal: 8,
      },
      '@media (max-width: 480px)': {
        paddingHorizontal: 4,
      },
    } as any),
  },
  cardContainer: {
    flexBasis: '100%',
    maxWidth: '100%',
    minWidth: '100%',
    flexGrow: 0,
    flexShrink: 0,
    marginVertical: isWeb ? 10 : 6,
    marginHorizontal: 0,
    ...(isWeb && {
      '@media (min-width: 1440px)': {
        flexBasis: '30%',
        maxWidth: '30%',
        minWidth: undefined,
        marginHorizontal: '1.5%',
      },
    } as any),
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
    ...(isWeb && {
      '@media (max-width: 768px)': {
        fontSize: 14,
      },
    } as any),
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
    ...(isWeb && {
      '@media (max-width: 768px)': {
        fontSize: 11,
        lineHeight: 14,
      },
    } as any),
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