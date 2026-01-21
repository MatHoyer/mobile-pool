import { styles } from "@/assets/styles";
import Typography from "@/components/Typography";
import useLocationStore from "@/hooks/locationStore";
import { weatherCodeToCondition } from "@/lib/utils";
import { Wind } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TCurrentWeather = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
};

const CurrentlyTab = () => {
  const location = useLocationStore((state) => state.location);
  const error = useLocationStore((state) => state.error);
  const setError = useLocationStore((state) => state.setError);
  const [currentWeather, setCurrentWeather] = useState<TCurrentWeather | null>(null);

  const fetchCurrentWeather = useCallback(async () => {
    if (!location) return;

    try {
      const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,wind_speed_10m,weathercode&timezone=Europe%2FParis`
      );
      if (!weather.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const currentwether = await weather.json();
      const parsedData = {
        temperature: currentwether.current.temperature_2m,
        windSpeed: currentwether.current.wind_speed_10m,
        weatherCode: currentwether.current.weathercode,
      };

      setCurrentWeather(parsedData);
    } catch {
      setError("Failed to fetch weather data");
    }
  }, [location, setError]);

  useEffect(() => {
    void fetchCurrentWeather();
  }, [fetchCurrentWeather]);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Typography variant="large" style={{ color: "red", textAlign: "center" }}>
          {error}
        </Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "column", alignItems: "center", gap: 10 }}>
        {currentWeather?.temperature !== undefined && (
          <Typography variant="h1">{currentWeather?.temperature}°</Typography>
        )}
        {currentWeather?.weatherCode !== undefined && (
          <Typography>{weatherCodeToCondition(currentWeather?.weatherCode)}</Typography>
        )}
        <Typography variant="large">{location.name}</Typography>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Typography>{location.region}</Typography>
          <Typography>{location.country}</Typography>
        </View>
        {currentWeather?.windSpeed !== undefined && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Wind />
            <Typography>{currentWeather?.windSpeed} km/h</Typography>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CurrentlyTab;
