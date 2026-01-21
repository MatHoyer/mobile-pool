import { WeatherAppBar } from "@/components/app/app-bar/AppBar.weather";
import { TabBar } from "@/components/app/TabBar.weather";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * display: "flex",
 * flexDirection: "column-reverse"
 *
 * This is to ensure that the tab bar is always at the bottom of the screen, regardless of the content of the screen.
 * And we need to put the weather app bar above the tab bar. because react native tab render catch the click otherwise.
 */

const TabViewIndex = () => {
  return (
    <SafeAreaView style={{ flex: 1, display: "flex", flexDirection: "column-reverse" }}>
      <TabBar />
      <WeatherAppBar />
    </SafeAreaView>
  );
};

export default TabViewIndex;
