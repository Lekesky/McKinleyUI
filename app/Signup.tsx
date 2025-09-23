import api from '@/services/api';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text, TextInput } from 'react-native-paper';
import AppleSignInButton from '../components/AppleSignInButton';
import GoogleSignInButton from '../components/GoogleSignInButton';


export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const goBackHandler = () => {router.back()}

  const signupHandler = async() => {
    const user = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      signInMethod: 'email'
    };

    api.post('/user', user )
      .then((response) => {
        console.log('User created successfully:', response.data);
        router.replace('/(tabs)/Home'); 
      })
      .catch((error) => {
        console.error('Error creating user:', error.message);
      });
  }

  const googleSignInHandler = async() => {
    console.log("Google Sign-In pressed");
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffffff' },
  backButton: { marginTop: 50, backgroundColor: '#e8e8e8ff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 20, fontFamily: 'Helvetica', fontSize: 30, color: '#871919ff', fontWeight: 'bold' },
  form: { marginTop: 10},
  textInput : { marginBottom: 15, backgroundColor: '#e8e8e8ff', height: 58 },
  textInputOutline: { borderRadius: 30, borderWidth: 0 },
  signupButton: { backgroundColor: '#871919ff', marginTop: 20, height: 58, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  continueWith: { marginTop: 20, marginBottom: 5, textAlign: 'center', color: '#3c3c3cff', fontWeight: 'bold', fontFamily: 'Helvetica', fontSize: 16 },
  socialButton: { backgroundColor: '#e8e8e8ff', marginTop: 15, height: 58, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  accountText: { marginTop: 30, alignItems: 'center', justifyContent: 'center' }
});