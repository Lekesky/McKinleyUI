import { createUserWithEmailAndPassword, getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import api from '../services/api';


export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firebaseUID, setFirebaseUID] = useState('');

  const signupHandler = async() => {

    //Utilize passwordValidationStatus from firebase
    try{
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match!");
            return;
        }
        createUserWithEmailAndPassword(getAuth(), email, password)
        .then((userCredential) => {
          const uid = userCredential.user.uid;
          setFirebaseUID(uid);
          api.post(`/user`, {
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: '1' + phoneNumber  //Added +1 for US phone number location, change later
          });
          getAuth().currentUser?.updateProfile({
            displayName: firstName + ', ' + lastName
          });
          router.replace('/(tabs)/Home'); // Redirect to Home after signup
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
      
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
      
          console.error(error);
        });
    }catch (error){
        console.error("Error signing up:", error);

        // If the user creation fails, delete the user from Firebase
        getAuth().currentUser?.delete().then(() => {
            console.log("User deleted successfully.");
        }).catch((error) => {
            console.error("Error deleting user:", error);
        });

        // If the user creation fails, delete the user from the API
        api.delete(`/user/${firebaseUID}`).then(() => {
            console.log("User deleted from API successfully.");
        })
        .catch((error) => {
            console.error("Error deleting user from API:", error);
        });

        Alert.alert("Error signing up. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <TextInput placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />
      <Button title="Signup" onPress={signupHandler} testID='Signup'/>
      <Text style={styles.link} onPress={() => router.replace('/Login')}>Already have an account? Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, color: '#fff' },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});
