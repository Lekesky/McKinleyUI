import { Image, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthModal } from '@/context/AuthModalContext';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import styles from '../styles/Intro.styles';

export default function Intro(){
    const insets = useSafeAreaInsets();
    const { showLoginModal, setShowLoginModal, showSignupModal, setShowSignupModal } = useAuthModal();
    
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
                <Button mode="contained" style={styles.continue} textColor='#871919ff' onPress={() => setShowSignupModal(true)} >Continue</Button>
            </View>
            
            {/* Login and Signup Modals */}
            <LoginModal 
                visible={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToSignup={() => {
                    setShowLoginModal(false);
                    setShowSignupModal(true);
                }}
            />
            <SignupModal 
                visible={showSignupModal}
                onClose={() => setShowSignupModal(false)}
                onSwitchToLogin={() => {
                    setShowSignupModal(false);
                    setShowLoginModal(true);
                }}
            />
        </View>
    );
}


