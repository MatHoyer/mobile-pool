import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar } from "./_components/TabBar";
import { WeatherAppBar } from "./_components/WeatherAppBar";

const TabViewIndex = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WeatherAppBar />
      <TabBar />
    </SafeAreaView>
  );
};

export default TabViewIndex;
