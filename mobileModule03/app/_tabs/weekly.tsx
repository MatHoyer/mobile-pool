import { styles } from "@/assets/styles";
import DailyChart from "@/components/tabs/weekly/DailyChart";
import DailyList from "@/components/tabs/weekly/DailyList";
import { TDailyWeather } from "@/components/tabs/weekly/types";
import Typography from "@/components/Typography";
import useLocationStore from "@/hooks/locationStore";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WeeklyTab = () => {
  const location = useLocationStore((state) => state.location);
  const error = useLocationStore((state) => state.error);
  const setError = useLocationStore((state) => state.setError);
  const [dailyWeather, setDailyWeather] = useState<TDailyWeather[]>([]);

  const fetchDailyWeather = useCallback(async () => {
    if (!location) return;

    try {
      const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=Europe%2FParis`
      );
      if (!weather.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const dailyWeather = await weather.json();
      const parsedData = dailyWeather.daily.time.map((time: string, index: number) => ({
        day: new Date(time),
        temperatureMax: dailyWeather.daily.temperature_2m_max[index],
        temperatureMin: dailyWeather.daily.temperature_2m_min[index],
        weatherCode: dailyWeather.daily.weathercode[index],
      }));
      setDailyWeather(parsedData);
    } catch {
      setError("Failed to fetch weather data");
    }
  }, [location, setError]);

  useEffect(() => {
    void fetchDailyWeather();
  }, [fetchDailyWeather]);

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
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Typography variant="h1">{location.name}</Typography>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Typography>{location.region}</Typography>
          <Typography>{location.country}</Typography>
        </View>
      </View>
      <DailyChart dailyWeather={dailyWeather} />
      <DailyList dailyWeather={dailyWeather} />
    </SafeAreaView>
  );
};

export default WeeklyTab;
