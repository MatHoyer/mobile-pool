import AppBar from "@/components/AppBar";
import { SeparatorVertical } from "@/components/Separator";
import { View } from "react-native";
import { Geoloc } from "./Geoloc";
import { SearchBar } from "./SearchBar";

export const WeatherAppBar = () => {
  return (
    <AppBar>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, gap: 10 }}>
        <SearchBar />
        <SeparatorVertical />
        <Geoloc />
      </View>
    </AppBar>
  );
};
