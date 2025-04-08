import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const RootLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default RootLayout;
