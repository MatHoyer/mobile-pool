import { SafeAreaView } from "react-native-safe-area-context";
import { WeatherAppBar } from "./_components/AppBar/WeatherAppBar";
import { TabBar } from "./_components/TabBar";

const TabViewIndex = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WeatherAppBar />
      <TabBar />
    </SafeAreaView>
  );
};

export default TabViewIndex;
