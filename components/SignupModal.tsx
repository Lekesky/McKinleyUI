import { useAuth } from '@/context/AuthContext';
import createAPIClient from '@/services/api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Modal, Platform, Pressable, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import styles from '../styles/Signup.styles';
import AppleSignInButton from './AppleSignInButton';
import FacebookSignInButton from './FacebookSignInButton';
import GoogleSignInButton from './GoogleSignInButton';
import parsePhoneNumber from 'libphonenumber-js'

interface SignupModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({ visible, onClose, onSwitchToLogin }: SignupModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {loginTokens, checkProfileComplete} = useAuth();
  const api = useMemo(() => createAPIClient(), []);
  
  // Password validation
  const hasCharMin = password.length >= 8 ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
  const hasUppercase = /[A-Z]/.test(password) ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
  const hasLowercase = /[a-z]/.test(password) ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
  const hasNumber = /[0-9]/.test(password) ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
  const hasSpecialChar = /[!@#$%^&*()]/.test(password) ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="close-circle-outline" size={24} color="red"/>;
  const passwordMeetsRequirements =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()]/.test(password);
  const hideRequirements = password.length === 0;
  
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const isWeb = Platform.OS === 'web';

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    if (Platform.OS !== 'web') {
      GoogleSignin.configure({
        webClientId: '1011866958643-vtl5rvrlcm0981gp21u5t43a557ion4k.apps.googleusercontent.com',
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
    }
  }, []); // Intentionally omitting handleGoogleSignInSuccess to avoid re-initialization

  const handleGoogleSignInSuccess = useCallback((idToken: string) => {
    if (!idToken) return;
    
    const user = {
      loginToken: idToken,
      signInMethod: 'google'
    };
    
    return api.post('/user/login', user)
      .then((response) => {
        if(Platform.OS !== 'web'){
          return loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid);
        }
        return response.data.uid;
      })
      .then((uid) => {
        console.log('Google sign-in successful');
        // Check if profile is complete
        return checkProfileComplete(uid || response.data.uid);
      })
      .then((isComplete) => {
        onClose();
        if (isComplete) {
          router.replace('/(tabs)');
        } else {
          router.replace('/completeProfile');
        }
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
      .catch(() => {
        // Silent - normal for first-time users
      });
  }, [handleGoogleSignInSuccess]);

  // Call trySilentSignIn after component mounts
  useEffect(() => {
    trySilentSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const signupHandler = useCallback(() => {
    if (!passwordMeetsRequirements) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Password',
        text2: 'Password must meet all requirements',
        position: 'top',
        backgroundColor: '#871919ff',
        textColor: '#FFFFFF',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
        position: 'top',
        backgroundColor: '#871919ff',
        textColor: '#FFFFFF',
      });
      return;
    }

    const user = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      signInMethod: 'email'
    };

    return api.post('/user', user)
      .then((response) => {
        if (Platform.OS !== 'web' && response.data.accessToken) {
          return loginTokens(response.data.accessToken, response.data.refreshToken, response.data.uid);
        }
      })
      .then(() => {
        console.log('Signup successful');
        onClose();
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
  }, [firstName, lastName, email, phoneNumber, password, confirmPassword, api, loginTokens, onClose]);

  const appleSignInHandler = () => {
    // Apple Sign-In implementation
  };

  const facebookSignInHandler = () => {
    // Facebook Sign-In implementation
  };

  const googleSignInHandler = useCallback(() => {
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
        <View style={[
          styles.modalContainer,
          isWeb && isMobile && { 
            width: '95%', 
            maxWidth: 420, 
            height: height * 0.99,
            maxHeight: height * 0.99,
            borderRadius: 16,
          },
          isWeb && !isMobile && {
            width: '90%',
            maxWidth: 1100,
            maxHeight: '90vh',
          }
        ]}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon source="close" size={24} color="#3c3c3cff" />
          </TouchableOpacity>

          <View style={[styles.modalContent, isMobile && { flexDirection: 'column' }]}>
            {/* Logo Section */}
            <View style={[
              styles.logoSection,
              isMobile && { flex: 0, padding: 15, paddingTop: 50, paddingBottom: 12 }
            ]}>
              <Image
                source={require('../assets/images/McKinleysGrill.png')}
                style={[
                  styles.logo,
                  isMobile && { height: 60, maxWidth: 90 }
                ]}
                resizeMode="contain"
              />
            </View>

            {/* Form Section */}
            <View style={[
              styles.formSection,
              isMobile && { padding: 18, paddingTop: 8, paddingBottom: 20 },
              !isMobile && { maxHeight: 'none', overflow: 'visible', paddingBottom: 20, paddingTop: 20 }
            ]}>
              <View style={[!isMobile && { width: '100%' }]}>
              <Text style={[
                styles.header, 
                isMobile && { fontSize: 20, marginBottom: 10, marginTop: 2, textAlign: 'center' },
                !isMobile && { marginBottom: 15 }
              ]}>Sign Up</Text>

              <View style={[styles.form, !isMobile && { marginBottom: 8 }]}>
                <Text style={[styles.inputLabel, !isMobile && { marginTop: 4, marginBottom: 4 }]}>First Name</Text>
                <TextInput
                  mode="outlined"
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={[styles.textInput, !isMobile && { marginBottom: 4 }]}
                  outlineStyle={styles.textInputOutline}
                />

                <Text style={[styles.inputLabel, !isMobile && { marginTop: 4, marginBottom: 4 }]}>Last Name</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  style={[styles.textInput, !isMobile && { marginBottom: 4 }]}
                  outlineStyle={styles.textInputOutline}
                />

                <Text style={[styles.inputLabel, !isMobile && { marginTop: 4, marginBottom: 4 }]}>Email</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.textInput, !isMobile && { marginBottom: 4 }]}
                  outlineStyle={styles.textInputOutline}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Text style={[styles.inputLabel, !isMobile && { marginTop: 4, marginBottom: 4 }]}>Phone Number</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  style={[styles.textInput, !isMobile && { marginBottom: 4 }]}
                  outlineStyle={styles.textInputOutline}
                  keyboardType="phone-pad"
                />

                <Text style={[styles.inputLabel, !isMobile && { marginTop: 4, marginBottom: 4 }]}>Password</Text>
                <View>
                  <TextInput
                    mode="outlined"
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    style={[styles.textInput, !isMobile && { marginBottom: 4 }]}
                    outlineStyle={styles.textInputOutline}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye" : "eye-off"}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                  {!hideRequirements && (
                    <View style={styles.requirements}>
                      <View style={styles.requirementRow}>
                        <View style={styles.requirementIcon}>{hasCharMin}</View>
                        <Text style={styles.requirementText}>At least 8 characters</Text>
                      </View>
                      <View style={styles.requirementRow}>
                        <View style={styles.requirementIcon}>{hasUppercase}</View>
                        <Text style={styles.requirementText}>At least 1 uppercase letter</Text>
                      </View>
                      <View style={styles.requirementRow}>
                        <View style={styles.requirementIcon}>{hasLowercase}</View>
                        <Text style={styles.requirementText}>At least 1 lowercase letter</Text>
                      </View>
                      <View style={styles.requirementRow}>
                        <View style={styles.requirementIcon}>{hasNumber}</View>
                        <Text style={styles.requirementText}>At least 1 number</Text>
                      </View>
                      <View style={styles.requirementRow}>
                        <View style={styles.requirementIcon}>{hasSpecialChar}</View>
                        <Text style={styles.requirementText}>At least 1 special character (!@#$%^&*())</Text>
                      </View>
                    </View>
                  )}
                </View>

                <Text style={[styles.inputLabel, !isMobile && { marginTop: 4, marginBottom: 4 }]}>Confirm Password</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={[styles.textInput, !isMobile && { marginBottom: 4 }]}
                  outlineStyle={styles.textInputOutline}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye" : "eye-off"}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />
              </View>

              <TouchableOpacity onPress={signupHandler} style={[styles.signupButton, !isMobile && { marginTop: 8 }]}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              <Text style={[styles.dividerText, !isMobile && { marginVertical: 12 }]}>Or Continue With</Text>

              <View style={[styles.socialButtons, !isMobile && { marginBottom: 12 }]}>
                <GoogleSignInButton onPress={googleSignInHandler} style={styles.socialButton} />
                <AppleSignInButton onPress={appleSignInHandler} style={styles.socialButton} disabled={true} />
                <FacebookSignInButton onPress={facebookSignInHandler} style={styles.socialButton} disabled={true} />
              </View>

              <View style={[styles.signupPrompt, !isMobile && { marginTop: 8, marginBottom: 0 }]}>
                <Text style={styles.promptText}>
                  Already have an account?{' '}
                  <Text
                    style={styles.linkText}
                    onPress={onSwitchToLogin}
                  >
                    Login
                  </Text>
                </Text>
              </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
