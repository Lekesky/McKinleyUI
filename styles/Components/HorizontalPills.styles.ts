import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    pillContainer: { 
        flexDirection: 'row',
        marginHorizontal: -20, // Extend beyond container padding for edge-to-edge appearance
    },
    selectedButton: {
        backgroundColor: '#600e0eff',
        elevation: 4,
    },
    buttonSegment: { 
        marginHorizontal: 5,
        marginVertical: 20, 
        backgroundColor: '#871919ff',
        minWidth: 105, // Ensure buttons have reasonable minimum width
    },
});

export default styles;