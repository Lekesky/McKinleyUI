import createAPIClient from '@/services/api';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
import AppleSignInButton from '../components/AppleSignInButton';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {loginTokens} = useAuth();
  const api = useMemo(() => createAPIClient(), []);

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    configureGoogleSignIn();
    // Try silent sign-in when component mounts (One Tap functionality)
    trySilentSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ignore missing dependency warning for trySilentSignIn

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: '1011866958643-vtl5rvrlcm0981gp21u5t43a557ion4k.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  };

  const goBackHandler = () => {router.back()}

  const loginHandler = async() => {
    const user = {
      email,
      password,
      signInMethod: 'email'
    };

    api.post('/user/login', user )
      .then(async (response) => {
        await loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid);
        router.replace('/(tabs)/Home'); 
      })
      .catch((error) => {
        console.error('Error loggging in user:', error.response.data);
      });
  }

  // This implements the Google One Tap functionality
  const trySilentSignIn = async () => {
    try {
      // signInSilently will throw if not signed in, so just try it
      const userInfo = await GoogleSignin.signInSilently();
      const idToken = (userInfo as any)?.idToken;
      if (idToken) {
        handleGoogleSignInSuccess(idToken);
      }
    } catch (error: unknown) {
      // It's normal for silent sign-in to fail if user hasn't signed in before
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as any).code !== statusCodes.SIGN_IN_REQUIRED
      ) {
        console.error("Silent sign-in error:", error);
      }
    }
  };

  const googleSignInHandler = async() => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = (userInfo as any)?.data.idToken;
      if (idToken) {
        handleGoogleSignInSuccess(idToken);
      } else {
        console.error("No ID token received from Google");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  }

  const handleGoogleSignInSuccess = async (idToken: string) => {
    if (!idToken) {
      console.error("No ID token received from Google");
      return;
    }
    const user = {
      loginToken: idToken,
      signInMethod: 'google'
    };
    api.post('/user/login', user )
      .then(async (response) => {
        await loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid);
        console.log('Response data:', response.data);
        router.replace('/(tabs)/Home'); 
      })
      .catch((error) => {
        console.error('Error logging in user:', error.response?.data || error);
      });
  }

  const appleSignInHandler = async() => {
    console.log("Apple Sign-In pressed");
  }

  

  return (
    <View style={styles.container}> 
      <View>
        <TouchableOpacity onPress={goBackHandler} style = {styles.backButton}>
          <Icon source="arrow-left" size={24} color ="#3c3c3cff"/>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.header}>Welcome Back</Text>
      </View>
      <View style={styles.form}>
        <TextInput mode="outlined" placeholder="Email" value={email} onChangeText={setEmail} style={styles.textInput} outlineStyle={styles.textInputOutline}/>
        <TextInput mode="outlined" placeholder="Password" secureTextEntry={true} value={password} onChangeText={setPassword} style={styles.textInput} right={<TextInput.Icon icon="eye-off" />} outlineStyle={styles.textInputOutline}/>
      </View>
      <View>
        <TouchableOpacity onPress={loginHandler} style={styles.loginButton}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Login</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style = {styles.continueWith}>Or continue with</Text>
      </View>
      <View>
        <GoogleSignInButton onPress={googleSignInHandler} style={styles.socialButton}/>
        <AppleSignInButton onPress={appleSignInHandler} style={styles.socialButton}/>
      </View>
      <View style= {styles.accountText}>
        <Text>Don&apos;t have an account? <Text style={{color: '#871919ff', fontWeight: 'bold'}} onPress={() => router.replace('/Signup')}>Sign Up</Text></Text>
      </View>
    </View>
  );
}