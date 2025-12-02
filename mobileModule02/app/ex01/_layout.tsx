import AppBar from "@/components/AppBar";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Typography from "@/components/Typography";
import useLocationStore, { TLocation } from "@/hooks/locationStore";
import * as Location from "expo-location";
import { Calendar, CalendarDays, LucideIcon, Navigation, Search, Sun } from "lucide-react-native";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
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

const LocationSuggestions: React.FC<
  {
    suggestions: TLocation[];
    touchingSuggestionRef: React.RefObject<boolean>;
    setIsFocused: (isFocused: boolean) => void;
  } & ComponentProps<typeof View>
> = ({ suggestions, touchingSuggestionRef, setIsFocused, style, ...props }) => {
  const setSelectedLocation = useLocationStore((state) => state.setLocation);

  const handleTouchStart = () => {
    touchingSuggestionRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      touchingSuggestionRef.current = false;
    }, 300);
  };

  return (
    <View
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={[
        style,
        {
          position: "absolute",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          zIndex: 999,
          maxHeight: 200,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      ]}
      {...props}
    >
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <Button
            variant="ghost"
            style={{ display: "flex", flexDirection: "row", alignItems: "baseline", height: 50, gap: 10 }}
            onPress={() => {
              setSelectedLocation(item);
              setIsFocused(false);
            }}
          >
            <Typography>{item.name}</Typography>
            <Typography variant="muted">{item.region}</Typography>
            <Typography variant="muted">{item.country}</Typography>
          </Button>
        )}
        keyExtractor={(_, index) => "" + index}
      />
    </View>
  );
};

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
  const [suggestions, setSuggestions] = useState<TLocation[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const searchRef = useRef<TextInput>(null);
  const touchingSuggestionRef = useRef(false);
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

  useEffect(() => {
    searchRef.current?.measureInWindow((x, y, width, height) => {
      setInputPosition({ x, y, width, height });
    });
  }, [searchRef.current, isFocused]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const resultSuggestions = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchLocation
        )}&count=5&language=fr&format=json`
      );
      const jsonData = (await resultSuggestions.json()) as {
        results: { name: string; admin1: string; country: string; latitude: number; longitude: number }[];
      };
      if (!jsonData?.results) {
        setSuggestions([]);
        return;
      }
      const data = jsonData.results
        .map((item) => ({
          name: item.name,
          region: item.admin1,
          country: item.country,
          lat: item.latitude,
          lon: item.longitude,
        }))
        .filter((s) => s.name || s.region || s.country);
      setSuggestions(data);
    };

    const fetchTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 150);

    return () => clearTimeout(fetchTimeout);
  }, [searchLocation]);

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
            placeholder="Search"
            style={{
              flex: 1,
              borderBottomLeftRadius: isFocused && suggestions.length > 0 ? 0 : 8,
              borderBottomRightRadius: isFocused && suggestions.length > 0 ? 0 : 8,
            }}
            onChangeText={setSearchLocation}
            value={searchLocation}
            inputRef={searchRef}
            onBlur={() => {
              if (touchingSuggestionRef.current) return;
              setTimeout(() => {
                setIsFocused(false);
              }, 200);
              if (suggestions.length > 0) {
                const suggestion = suggestions[0];
                setLocation({
                  name: suggestion.name,
                  region: suggestion.region,
                  country: suggestion.country,
                  lat: suggestion.lat,
                  lon: suggestion.lon,
                });
                return;
              }
              setLocation(null);
            }}
            onFocus={() => setIsFocused(true)}
          />
          <View style={{ width: 2, height: 20, backgroundColor: "black" }} />
          <View style={{ width: 40 }}>
            <Button variant="ghost" onPress={handleGeolocation}>
              <Navigation color="black" />
            </Button>
          </View>
        </View>
      </AppBar>
      <LocationSuggestions
        suggestions={suggestions}
        style={{
          display: isFocused && suggestions.length > 0 ? "flex" : "none",
          top: inputPosition.y + inputPosition.height,
          left: inputPosition.x,
          width: inputPosition.width,
        }}
        touchingSuggestionRef={touchingSuggestionRef}
        setIsFocused={setIsFocused}
      />
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
