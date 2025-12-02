import AppBar from "@/components/AppBar";
import Button from "@/components/Button";
import Input from "@/components/Input";
import useLocationStore from "@/hooks/locationStore";
import * as Location from "expo-location";
import { Calendar, CalendarDays, LucideIcon, Navigation, Search, Sun } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
import CurrentlyTab from "./currently";
import TodayTab from "./today";
import WeeklyTab from "./weekly";

type TabRoute = { key: string; title: string; icon: LucideIcon };

const routes: TabRoute[] = [
  { key: "currently", title: "Currently", icon: Sun },
  { key: "today", title: "Today", icon: Calendar },
  { key: "weekly", title: "Weekly", icon: CalendarDays },
];

const TabLayout = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderScene = ({ route }: { route: TabRoute }) => {
    switch (route.key) {
      case "currently":
        return <CurrentlyTab />;
      case "today":
        return <TodayTab />;
      case "weekly":
        return <WeeklyTab />;
      default:
        return null;
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {routes.map((route, i) => {
        const Icon = route.icon;
        const isActive = index === i;
        return (
          <TouchableOpacity key={route.key} style={styles.tab} onPress={() => setIndex(i)}>
            <Icon size={24} color={isActive ? "blue" : "gray"} />
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{route.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const [searchLocation, setSearchLocation] = useState("");
  const searchRef = useRef<TextInput>(null);
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);

  const handleGeolocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocation(null);
      return;
    }

    const location = await Location.getCurrentPositionAsync();
    const { coords } = location;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
    );
    const data = await response.json();

    setLocation({
      name: data.address?.city || data.address?.town || data.address?.village || "",
      region: data.address?.state || "",
      country: data.address?.country || "",
      lat: coords.latitude,
      lon: coords.longitude,
    });
  };

  useEffect(() => {
    handleGeolocation();
  }, []);

  useEffect(() => {
    setSearchLocation(!!location ? location.name : "");
  }, [location]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <AppBar>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, gap: 10 }}>
          <Search color="black" />
          <Input
            inputRef={searchRef}
            placeholder="Search"
            style={{
              flex: 1,
            }}
            onChangeText={setSearchLocation}
            value={searchLocation}
            onBlur={() => {
              setLocation({
                name: searchLocation,
                region: "",
                country: "",
                lat: 0,
                lon: 0,
              });
            }}
          />
          <View style={{ width: 2, height: 20, backgroundColor: "black" }} />
          <View style={{ width: 40 }}>
            <Button variant="ghost" onPress={handleGeolocation}>
              <Navigation color="black" />
            </Button>
          </View>
        </View>
      </AppBar>
      <TabView
        navigationState={{ index, routes: routes as any }}
        renderScene={({ route }) => renderScene({ route: route as unknown as TabRoute })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        tabBarPosition="bottom"
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "gray",
  },
  tabTextActive: {
    color: "blue",
    fontWeight: "600",
  },
});

export default TabLayout;
