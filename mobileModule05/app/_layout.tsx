import { AuthProvider } from "@/components/providers/auth.provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../firebaseConfig";

const RootLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </>
  );
};

export default RootLayout;
