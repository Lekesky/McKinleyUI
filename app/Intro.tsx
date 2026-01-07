import { router } from 'expo-router';
import { Image, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/Intro.styles';



const handleSignInPage = () => {
    router.push('/Signup')
}


export default function Intro(){
    const insets = useSafeAreaInsets();
    
    return(
        <View style={[styles.container1, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.container2}>
                <Image source={require("@/assets/images/McKinleysGrill.png")} style={styles.image} />
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


