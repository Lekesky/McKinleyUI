import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to Intro so the RootLayout/Auth flow determines the correct landing page
  // This avoids a conflicting immediate redirect to /Login which can cause route bouncing
  return <Redirect href="/Intro" />;
}
