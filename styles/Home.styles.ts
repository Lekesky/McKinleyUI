import { Platform, StyleSheet } from 'react-native';
const isWeb = Platform.OS === 'web';
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffffff',
  },
  viewController: {
      alignSelf: "center",
      marginTop: isWeb ? "1.5%" : "15%",
  }
});

export default styles;