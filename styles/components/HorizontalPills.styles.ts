import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    pillContainer: { 
        flexDirection: 'row',
        alignSelf: isWeb ? 'center' : 'auto',
    },
    selectedButton: {
        backgroundColor: '#600e0eff',
        elevation: 4,
    },
    buttonSegment: { 
        marginHorizontal: 5,
        marginVertical: 20, 
        backgroundColor: '#871919ff',
        minWidth: 105,
    },
});

export default styles;