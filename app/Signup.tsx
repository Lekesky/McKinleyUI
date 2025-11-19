import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import AppleSignInButton from '../components/AppleSignInButton';
import GoogleSignInButton from '../components/GoogleSignInButton';
import styles from '../styles/Signup.styles';


export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {loginTokens} = useAuth();
  const api = useMemo(() => createAPIClient(), []);

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    // Only configure the native GoogleSignin on mobile platforms.
    if (Platform.OS !== 'web') {
      configureGoogleSignIn();
    }

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

  const trySilentSignIn = useCallback(() => {
    // Do not attempt native GoogleSignin on web (not implemented there).
    if (Platform.OS === 'web') return Promise.resolve();

    return GoogleSignin.signInSilently()
      .then((userInfo) => {
        const idToken = (userInfo as any)?.idToken;
        if (idToken) {
          handleGoogleSignInSuccess(idToken);
        }
      })
      .catch(() => {
        // Silent - normal for first-time users
      });
  }, []);

  const googleSignInHandler = useCallback(() => {
    // On web, use Google Identity Services
    if (Platform.OS === 'web') {
      const g = (window as any).google;
      if (g?.accounts?.id) {
        g.accounts.id.prompt();
      }
      return Promise.resolve();
    }

    return GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      .then(() => GoogleSignin.signIn())
      .then((userInfo) => {
        const idToken = (userInfo as any)?.data.idToken;
        if (idToken) {
          handleGoogleSignInSuccess(idToken);
        }
      })
      .catch(() => {
        // Silent error
      });
  }, []);

  const handleGoogleSignInSuccess = useCallback((idToken: string) => {
    if (!idToken) return;
    
    const user = {
      loginToken: idToken,
      signInMethod: 'google'
    };
    
    return api.post('/user/login', user, { withCredentials: true })
      .then((response) => {
        if(Platform.OS !== 'web'){
          return loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid);
        }
      })
      .then(() => {
        router.replace('/(tabs)/Home');
      })
      .catch((error) => {
        const errorMessage = error.response?.data || error.message || 'Google sign-in failed';
        Toast.show({
          type: 'error',
          text1: 'Sign-In Failed',
          text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to sign in with Google',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
        });
      });
  }, [api, loginTokens]);

  // Load Google Identity Services (web only) and configure a callback that reuses
  // the same native `handleGoogleSignInSuccess` flow (it posts idToken to /user/login).
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const googleClientId = '1011866958643-vtl5rvrlcm0981gp21u5t43a557ion4k.apps.googleusercontent.com';

    const handleCredentialResponse = (response: any) => {
      const idToken = response?.credential;
      if (idToken) {
        handleGoogleSignInSuccess(idToken);
      }
    };

    // Don't load twice
    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.initialize({ client_id: googleClientId, callback: handleCredentialResponse });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      (window as any).google?.accounts?.id?.initialize({ 
        client_id: googleClientId, 
        callback: handleCredentialResponse 
      });
    };
    document.head.appendChild(script);

    return () => {
      script.parentNode?.removeChild(script);
    };
    // We intentionally do not include handleGoogleSignInSuccess in deps to avoid re-initializing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBackHandler = () => {router.back()}

  const signupHandler = useCallback(() => {
    const user = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      signInMethod: 'email'
    };

    return api.post('/user', user)
      .then(() => {
        router.replace('/(tabs)/Home');
      })
      .catch((error) => {
        const errorMessage = error.response?.data || error.message || 'Signup failed';
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to create account',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
        });
      });
  }, [firstName, lastName, email, phoneNumber, password, api]);

  const appleSignInHandler = () => {
    // Apple Sign-In implementation
  }

  

  return (
    <View style={styles.container}> 
      <View>
        <TouchableOpacity onPress={goBackHandler} style = {styles.backButton}>
          <Icon source="arrow-left" size={24} color ="#3c3c3cff"/>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.header}>Register Now</Text>
      </View>
      <View style={styles.form}>
        <TextInput mode="outlined" placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.textInput} outlineStyle={styles.textInputOutline}/>
        <TextInput mode="outlined" placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.textInput} outlineStyle={styles.textInputOutline}/>
        <TextInput mode="outlined" placeholder="Email" value={email} onChangeText={setEmail} style={styles.textInput} outlineStyle={styles.textInputOutline}/>
        <TextInput mode="outlined" placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.textInput} outlineStyle={styles.textInputOutline}/>
        <TextInput mode="outlined" placeholder="Password" secureTextEntry={true} value={password} onChangeText={setPassword} style={styles.textInput} right={<TextInput.Icon icon="eye-off" />} outlineStyle={styles.textInputOutline}/>
        <TextInput mode="outlined" placeholder="Confirm Password" secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword} style={styles.textInput} right={<TextInput.Icon icon="eye-off" />} outlineStyle={styles.textInputOutline}/>
      </View>
      <View>
        <TouchableOpacity onPress={signupHandler} style={styles.signupButton}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Sign Up</Text>
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
        <Text>Already have an account? <Text style={{color: '#871919ff', fontWeight: 'bold'}} onPress={() => router.replace('/Login')}>Login</Text></Text>
      </View>
    </View>
  );
}

