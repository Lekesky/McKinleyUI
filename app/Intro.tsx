import { router } from 'expo-router';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import McKinleyLogo from '../assets/images/McKinleysGrill.png';

const { width, height } = Dimensions.get('window');
const screenWidth = Math.min(width, height);

// Calculate responsive font size
const responsiveFontSize = (size : number) => {
    return (screenWidth * size) / 100;
}

const handleSignInPage = () => {
    router.push('/Signup')
}


export default function Intro(){
    
    return(
        <View style={styles.container1}>
            <View style={styles.container2}>
                <Image source={McKinleyLogo} style={styles.image} />
            </View>
            <View>
                <Text style={styles.headline}>Welcome to the McKinley&apos;s Grill</Text>
                <Text style={styles.subheading}>Order breakfast, lunch, and dinner with just a few taps away!</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.continue} textColor='#871919ff' onPress={handleSignInPage} >Continue</Button>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container1: { flex: 1, backgroundColor: '#871919ff'},
    container2: { width: "100%", justifyContent: 'center', alignItems: 'center', height: "60%", backgroundColor: '#fff', borderRadius: 35 },
    image: {width: '80%', height: '80%'},
    headline: { textAlign: 'center', color: '#fff', marginTop: 60, fontWeight: 'bold', fontFamily: 'Helvetica', fontSize: responsiveFontSize(6.5), marginHorizontal: '2%'},
    subheading: { textAlign: 'center', color: '#fff', marginTop: 20, fontFamily: 'Helvetica', fontSize: responsiveFontSize(4), marginHorizontal: '2%'},
    buttonContainer: { flex: 1, justifyContent: 'flex-end', marginBottom: 36 },
    continue: {bottom: 15, justifyContent: 'center', height: 50, marginHorizontal: 20, borderRadius: 25, backgroundColor: '#fff'}
});