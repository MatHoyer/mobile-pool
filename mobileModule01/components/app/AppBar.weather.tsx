import AppBar from "@/components/AppBar";
import Button from "@/components/Button";
import Input from "@/components/Input";
import useLocationStore from "@/hooks/locationStore";
import { Navigation, Search } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

export const WeatherAppBar = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const setLocation = useLocationStore((state) => state.setLocation);

  const handleGeolocation = () => {
    setLocation("Geolocation");
  };

  const handleSearch = (text: string) => {
    setLocation(text);
    setSearchLocation("");
  };

  return (
    <AppBar>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, gap: 10 }}>
        <Search color="black" />
        <Input
          placeholder="Search"
          style={{ flex: 1 }}
          onChangeText={setSearchLocation}
          value={searchLocation}
          onBlur={() => handleSearch(searchLocation)}
        />
        <View style={{ width: 2, height: 20, backgroundColor: "black" }} />
        <View style={{ width: 40 }}>
          <Button variant="ghost" onPress={handleGeolocation}>
            <Navigation color="black" />
          </Button>
        </View>
      </View>
    </AppBar>
  );
};
