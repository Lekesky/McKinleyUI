import { Platform, StyleSheet } from 'react-native';
const isWeb = Platform.OS === 'web';
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffffff',
    ...(isWeb && {
      // @ts-ignore
      '@media (max-width: 768px)': {
        padding: 0,
      },
    }),
  },
  viewController: {
      alignSelf: "center",
      marginTop: isWeb ? "1.5%" : 15,
  }
});

export default styles;