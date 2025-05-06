import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import api from '../services/api';
import auth from '../services/firebaseConfig';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  let firebaseUID = null;

  const signupHandler = async() => {
    try{
        if(firstName.length < 3) {
            alert("First name must be at least 3 characters long!");
        }
        if(lastName.length < 3) {
          alert("Last name must be at least 3 characters long!");
      }
        if (password.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (auth) {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, {displayName: firstName,}); //Add username to user profile
          const firebaseUID = userCredential.user.uid;

          await api.post('/user', {
            uid: firebaseUID,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber
          });
          
        } else {
            console.error("Firebase auth instance is null.");
            alert("Authentication service is unavailable. Please try again later.");
        }
        router.replace('/Login');
    }catch (error){
        console.error("Error signing up:", error);

        // If the user creation fails, delete the user from Firebase
        auth?.currentUser?.delete().then(() => {
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

        alert("Error signing up. Please try again.");
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
      <Button title="Signup" onPress={signupHandler} />
      <Text style={styles.link} onPress={() => router.push('/Login')}>Already have an account? Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, color: '#fff' },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});
