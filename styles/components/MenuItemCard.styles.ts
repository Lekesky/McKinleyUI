import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

export const getStyles = (windowWidth: number) => {
  const isMobile = windowWidth <= 768;
  
  return StyleSheet.create({
    cardContainer: {
      width: isMobile || !isWeb ? '100%' : undefined,
      flexBasis: isMobile || !isWeb ? '100%' : '30%',
      maxWidth: isMobile || !isWeb ? '100%' : '30%',
      flexGrow: 0,
      flexShrink: 0,
      marginVertical: isWeb ? 10 : 6,
      marginHorizontal: isMobile || !isWeb ? 0 : 12,
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
      fontSize: isMobile && isWeb ? 14 : 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#000',
    },
    description: {
      fontSize: isMobile && isWeb ? 11 : 12,
      color: '#666',
      marginBottom: 8,
      lineHeight: isMobile && isWeb ? 14 : 16,
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
};

export default getStyles;