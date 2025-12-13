import { WeatherAppBar } from "@/components/app/AppBar.weather";
import { WeathersTabBar } from "@/components/app/TabBar.weather";
import { SafeAreaView } from "react-native-safe-area-context";

const TabViewIndex = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WeatherAppBar />
      <WeathersTabBar />
    </SafeAreaView>
  );
};

export default TabViewIndex;
