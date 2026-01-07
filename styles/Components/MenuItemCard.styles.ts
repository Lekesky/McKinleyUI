import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    cardContainer: {
    // Use flex-basis and maxWidth for predictable wrapping on web; full-width on mobile
    flexBasis: isWeb ? '30%' : '100%',
    maxWidth: isWeb ? '30%' : '100%',
    flexGrow: 0,
    marginVertical: isWeb ? 10 : 6,
    marginHorizontal: isWeb ? 12 : 0,
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
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
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