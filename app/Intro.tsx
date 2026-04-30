import {
    clearAuthRedirectAction,
    storeAuthRedirectAction,
} from '@/services/authRedirect';
import {
    getAuth0AuthorizeOptions,
    getAuth0AuthorizeParameters,
} from '@/services/auth0';
import { Image, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/Intro.styles';

export default function Intro(){
    const insets = useSafeAreaInsets();
    const { authorize } = useAuth0();
    
    const handleContinue = async () => {
        storeAuthRedirectAction('signup');

        try {
            await authorize(
                getAuth0AuthorizeParameters(),
                getAuth0AuthorizeOptions()
            );
        } catch (error) {
            clearAuthRedirectAction();
            console.error('Signup redirect failed:', error);
        }
    };

    const handleSignIn = async () => {
        storeAuthRedirectAction('login');

        try {
            await authorize(
                getAuth0AuthorizeParameters(),
                getAuth0AuthorizeOptions()
            );
        } catch (error) {
            clearAuthRedirectAction();
            console.error('Login redirect failed:', error);
        }
    };
    
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
                <Button 
                    mode="contained" 
                    style={styles.continue} 
                    textColor='#871919ff' 
                    onPress={handleContinue}
                >
                    Continue
                </Button>
                <Button 
                    mode="text" 
                    style={{ marginTop: 12 }}
                    textColor='#FFFFFF'
                    onPress={handleSignIn}
                >
                    Already have an account? Sign In
                </Button>
            </View>
        </View>
    );
}

