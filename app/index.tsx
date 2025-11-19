import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

export default function Index() {
  return Platform.OS === 'web' ? <Redirect href="/(tabs)/Home" /> : <Redirect href="/Intro" />;
}
