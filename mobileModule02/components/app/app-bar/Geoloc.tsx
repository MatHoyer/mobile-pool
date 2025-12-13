import Button from "@/components/Button";
import useLocationStore from "@/hooks/locationStore";
import * as Location from "expo-location";
import { Navigation } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { View } from "react-native";

export const Geoloc = () => {
  const setLocation = useLocationStore((state) => state.setLocation);
  const setError = useLocationStore((state) => state.setError);

  const handleGeolocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation(null);
        setError("Geolocation is not available, please enable it in your settings.");
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
    } catch {
      setLocation(null);
      setError("Could not get your location");
    }
  }, [setLocation, setError]);

  useEffect(() => {
    void handleGeolocation();
  }, [handleGeolocation]);

  return (
    <View style={{ width: 40 }}>
      <Button variant="ghost" onPress={handleGeolocation}>
        <Navigation color="black" />
      </Button>
    </View>
  );
};
