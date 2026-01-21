import { styles } from "@/assets/styles";
import HourlyChart from "@/components/tabs/today/HourlyChart";
import HourlyList from "@/components/tabs/today/HourlyList";
import { THourlyWeather } from "@/components/tabs/today/types";
import Typography from "@/components/Typography";
import useLocationStore from "@/hooks/locationStore";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TodayTab = () => {
  const location = useLocationStore((state) => state.location);
  const error = useLocationStore((state) => state.error);
  const setError = useLocationStore((state) => state.setError);
  const [hourlyWeather, setHourlyWeather] = useState<THourlyWeather[]>([]);

  const fetchHourlyWeather = useCallback(async () => {
    if (!location) return;

    try {
      const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,wind_speed_10m,weathercode&forecast_days=1&timezone=Europe%2FParis`
      );
      if (!weather.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const hourlyWeather = await weather.json();
      const parsedData = hourlyWeather.hourly.time.map((time: string, index: number) => ({
        hour: new Date(time),
        temperature: hourlyWeather.hourly.temperature_2m[index],
        windSpeed: hourlyWeather.hourly.wind_speed_10m[index],
        weatherCode: hourlyWeather.hourly.weathercode[index],
      }));
      setHourlyWeather(parsedData);
    } catch {
      setError("Failed to fetch weather data");
    }
  }, [location, setError]);

  useEffect(() => {
    void fetchHourlyWeather();
  }, [fetchHourlyWeather]);

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
      <HourlyChart hourlyWeather={hourlyWeather} />
      <HourlyList hourlyWeather={hourlyWeather} />
    </SafeAreaView>
  );
};

export default TodayTab;
