import { Calendar, CalendarDays, LucideIcon, Sun } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
import CurrentlyTab from "./currently";
import TodayTab from "./today";
import WeeklyTab from "./weekly";

type TabRoute = { key: string; title: string; icon: LucideIcon };

const TabLayout = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const routes: TabRoute[] = [
    { key: "currently", title: "Currently", icon: Sun },
    { key: "today", title: "Today", icon: Calendar },
    { key: "weekly", title: "Weekly", icon: CalendarDays },
  ];

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
