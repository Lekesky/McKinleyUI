import createAPIClient from '@/services/api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Modal, Platform, Pressable, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.styles';
import AppleSignInButton from './AppleSignInButton';
import FacebookSignInButton from './FacebookSignInButton';
import GoogleSignInButton from './GoogleSignInButton';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ visible, onClose, onSwitchToSignup }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {loginTokens, checkProfileComplete} = useAuth();
  const api = useMemo(() => createAPIClient(), []);
  
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    // Only configure native GoogleSignin on mobile platforms.
    if (Platform.OS !== 'web') {
      GoogleSignin.configure({
        webClientId: '1011866958643-vtl5rvrlcm0981gp21u5t43a557ion4k.apps.googleusercontent.com',
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
    }

    // Try silent sign-in when component mounts (One Tap functionality)
    trySilentSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ignore missing dependency warning for trySilentSignIn

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
        return loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid);
      })
      .then(() => {
        console.log('loginTokens completed successfully');
        onClose();
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
  }, [email, password, api, loginTokens, onClose]);

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
        
        return loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid)
          .then(() => response.data.uid);
      })
      .then((uid) => {
        console.log('Google sign-in successful');
        // Check if profile is complete
        return checkProfileComplete(uid);
      })
      .then((isComplete) => {
        onClose();
        if (isComplete) {
          router.replace('/(tabs)/Home');
        } else {
          router.replace('/completeProfile');
        }
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
  }, [api, loginTokens, checkProfileComplete, onClose]);

  const trySilentSignIn = useCallback(() => {
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

  // Load Google Identity Services (web only)
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;

    const googleClientId = '1011866958643-vtl5rvrlcm0981gp21u5t43a557ion4k.apps.googleusercontent.com';

    const handleCredentialResponse = (response: any) => {
      const idToken = response?.credential;
      if (idToken) {
        handleGoogleSignInSuccess(idToken);
      }
    };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const appleSignInHandler = () => {
    // Apple Sign-In implementation
  };

  const googleSignInHandler = useCallback(() => {
    if (Platform.OS === 'web') {
      const g = (window as any).google;
      if (g && g.accounts && g.accounts.id) {
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon source="close" size={24} color="#3c3c3cff" />
          </TouchableOpacity>

          <View style={[styles.modalContent, isMobile && { flexDirection: 'column' }]}>
            {/* Logo Section */}
            <View style={[
              styles.logoSection,
              isMobile && { flex: 0, padding: 20, paddingTop: 55, paddingBottom: 20 }
            ]}>
              <Image
                source={require('../assets/images/McKinleysGrill.png')}
                style={[
                  styles.logo,
                  isMobile && { height: 80, maxWidth: 120 }
                ]}
                resizeMode="contain"
              />
            </View>

            {/* Form Section */}
            <View style={[
              styles.formSection,
              isMobile && { padding: 25, paddingTop: 15 }
            ]}>
              <Text style={[styles.header, isMobile && { fontSize: 24, marginBottom: 18, textAlign: 'center' }]}>Login</Text>

              <View style={styles.form}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.textInput}
                  outlineStyle={styles.textInputOutline}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.textInput}
                  outlineStyle={styles.textInputOutline}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye" : "eye-off"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </View>

              <TouchableOpacity onPress={loginHandler} style={styles.loginButton}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>

              <Text style={styles.dividerText}>Or Continue With</Text>

              <View style={styles.socialButtons}>
                <GoogleSignInButton onPress={googleSignInHandler} style={styles.socialButton} />
                <AppleSignInButton onPress={appleSignInHandler} style={styles.socialButton} disabled={true} />
                <FacebookSignInButton onPress={() => {}} style={styles.socialButton} disabled={true} />
              </View>

              <View style={styles.signupPrompt}>
                <Text style={styles.promptText}>
                  Don&apos;t have an account?{' '}
                  <Text
                    style={styles.linkText}
                    onPress={onSwitchToSignup}
                  >
                    Sign Up
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
