import { styles } from "@/assets/styles";
import Typography from "@/components/Typography";
import useLocationStore from "@/hooks/locationStore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TCurrentWeather = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
};

const CurrentlyTab = () => {
  const location = useLocationStore((state) => state.location);
  const [currentWeather, setCurrentWeather] = useState<TCurrentWeather | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchCurrentWeather = async () => {
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
        setCurrentWeather(null);
      }
    };

    fetchCurrentWeather();
  }, [location]);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Typography variant="large" style={{ color: "red", textAlign: "center" }}>
          Geolocation is not available, please enable it in your settings.
        </Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="large">Currently</Typography>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {location.name && <Typography>{location.name}</Typography>}
        {location.region && <Typography>{location.region}</Typography>}
        {location.country && <Typography>{location.country}</Typography>}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Typography>{location.lat}</Typography>
        <Typography>{location.lon}</Typography>
      </View>
    </SafeAreaView>
  );
};

export default CurrentlyTab;
