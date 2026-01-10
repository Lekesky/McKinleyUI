import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenWidth = Math.min(width, height);
const isWeb = Platform.OS === 'web';

// Calculate responsive font size
const responsiveFontSize = (size : number) => {
    return (screenWidth * size) / 100;
}

const styles = StyleSheet.create({
    container1: { 
        flex: 1, 
        backgroundColor: '#871919ff'
    },
    container2: { 
        width: "100%", 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: "60%", 
        backgroundColor: '#fff', 
        borderBottomLeftRadius: 35, 
        borderBottomRightRadius: 35 
    },
    imageContainer: { 
        justifyContent: 'center',
        borderRadius: 35 
    },
    image: {
        width: '80%', 
        height: '80%'
    },
    headline: { 
        textAlign: 'center', 
        color: '#fff', 
        marginTop: 60, 
        fontWeight: 'bold', 
        fontFamily: 'Helvetica', 
        fontSize: responsiveFontSize(6.5), 
        marginHorizontal: '2%',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                marginTop: 40,
                fontSize: responsiveFontSize(5.5),
            },
        } as any),
    },
    subheading: { 
        textAlign: 'center', 
        color: '#fff', 
        marginTop: 20, 
        fontFamily: 'Helvetica', 
        fontSize: responsiveFontSize(4), 
        marginHorizontal: '2%',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                marginTop: 16,
                fontSize: responsiveFontSize(3.5),
            },
        } as any),
    },
    buttonContainer: { 
        flex: 1, 
        justifyContent: 'flex-end', 
        marginBottom: 36 
    },
    continue: {
        bottom: 15, 
        justifyContent: 'center', 
        height: 50, 
        marginHorizontal: 20, 
        borderRadius: 25, 
        backgroundColor: '#fff'
    }
});

export default styles;