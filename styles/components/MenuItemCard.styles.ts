import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    cardContainer: {
    flexBasis: isWeb ? '30%' : '100%',
    maxWidth: isWeb ? '30%' : '100%',
    flexGrow: 0,
    marginVertical: isWeb ? 10 : 6,
    marginHorizontal: isWeb ? 12 : 0,
    ...(isWeb && {
      '@media (max-width: 768px)': {
        flexBasis: '45%',
        maxWidth: '45%',
        marginHorizontal: 8,
      },
      '@media (max-width: 480px)': {
        flexBasis: '100%',
        maxWidth: '100%',
        marginHorizontal: 0,
      },
    } as any),
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  image: {
    height: 120,
    width: '100%',
  },
  contentContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
    ...(isWeb && {
      '@media (max-width: 768px)': {
        fontSize: 14,
      },
    } as any),
  },
  description: {
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
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#871919ff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#333',
  },
});

export default styles;