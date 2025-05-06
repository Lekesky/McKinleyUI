import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import auth from '../services/firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async() => {
     try{
        if (auth) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log("User logged in successfully.");
        } else {
          console.error("Firebase auth instance is null.");
          alert("Authentication service is unavailable. Please try again later.");
        }
        router.replace('/(tabs)/Home');
        }catch (error){
            console.error("Error signing up:", error);
            alert("Error signing up. Please try again.");
        }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title="Login" onPress={loginHandler} />
      <Text style={styles.link} onPress={() => router.push('/Signup')}>Don&apos;t have an account? Sign up</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, color: '#fff' },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});
