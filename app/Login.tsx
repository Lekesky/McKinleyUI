import createAPIClient from '@/services/api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
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
    // Only configure native GoogleSignin on mobile platforms.
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

  const goBackHandler = () => { router.back() }

  const loginHandler = useCallback(() => {
    const user = {
      email,
      password,
      signInMethod: 'email'
    };

    console.log('Attempting login...');
    return api.post('/user/login', user)
      .then((response) => {
        console.log('Login response:', response.data);
        console.log('Calling loginTokens with:', {
          accessToken: response.data.accessToken ? 'present' : 'missing',
          refreshToken: response.data.refreshToken ? 'present' : 'missing',
          uid: response.data.uid
        });
        return loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid);
      })
      .then(() => {
        console.log('loginTokens completed successfully');
      })
      .catch((error) => {
        console.error('Login error:', error);
        const errorMessage = error.response?.data || error.message || 'Login failed';
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: typeof errorMessage === 'string' ? errorMessage : 'Invalid email or password',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
        });
      });
  }, [email, password, api, loginTokens]);

  const handleGoogleSignInSuccess = useCallback((idToken: string) => {
    if (!idToken) {
      console.error('No idToken provided to handleGoogleSignInSuccess');
      return Promise.resolve();
    }
    
    const user = {
      loginToken: idToken,
      signInMethod: 'google'
    };
    
    console.log('Sending Google sign-in request to backend...');
    return api.post('/user/login', user)
      .then((response) => {
        console.log('Google sign-in response:', response.data);
        
        if (!response.data.uid) {
          console.error('Missing tokens in response:', response.data);
          Toast.show({
            type: 'error',
            text1: 'Sign-In Failed',
            text2: 'Invalid response from server',
            position: 'top',
            backgroundColor: '#871919ff',
            textColor: '#FFFFFF',
          });
          return Promise.reject(new Error('Invalid response from server'));
        }
        
        return loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid);
      })
      .then(() => {
        console.log('Google sign-in successful, AuthenticatedLayout will handle navigation');
      })
      .catch((error: any) => {
        console.error('Google sign-in error:', error);
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
      .catch((error: unknown) => {
        console.log('Silent sign-in failed (expected if not signed in before):', error);
      });
  }, [handleGoogleSignInSuccess]);

  

  const googleSignInHandler = useCallback(() => {
    // On web, use Google Identity Services (loaded separately) to get an ID token
    if (Platform.OS === 'web') {
      const g = (window as any).google;
      if (g && g.accounts && g.accounts.id) {
        // Prompt the One Tap / credential dialog
        g.accounts.id.prompt();
      }
      return Promise.resolve();
    }

    return GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      .then(() => GoogleSignin.signIn())
      .then((userInfo) => {
        const idToken = (userInfo as any)?.data?.idToken;
        
        if (idToken) {
          return handleGoogleSignInSuccess(idToken);
        } else {
          console.error('No idToken received from Google Sign-In');
          Toast.show({
            type: 'error',
            text1: 'Google Sign-In',
            text2: 'Failed to get authentication token',
            position: 'top',
            backgroundColor: '#871919ff',
            textColor: '#FFFFFF',
          });
        }
      })
      .catch((error: any) => {
        console.error('Google Sign-In error:', error);
        Toast.show({
          type: 'error',
          text1: 'Google Sign-In Failed',
          text2: error.message || 'An error occurred',
          position: 'top',
          backgroundColor: '#871919ff',
          textColor: '#FFFFFF',
        });
      });
  }, [handleGoogleSignInSuccess]);


  

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
    if ((window as any).google && (window as any).google.accounts && (window as any).google.accounts.id) {
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