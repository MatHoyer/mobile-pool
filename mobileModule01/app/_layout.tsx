import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const TabLayout = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default TabLayout;
