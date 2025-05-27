import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async() => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then(() => {
        router.replace('/(tabs)/Home'); // Redirect to Profile page after successful login
      }).catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title="Login" onPress={loginHandler} testID = "LoginButton"/>
      <Text style={styles.link} onPress={() => router.replace('/Signup')}>Don&apos;t have an account? Sign up</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, color: '#fff' },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});
