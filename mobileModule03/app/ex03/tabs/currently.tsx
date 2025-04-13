import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { weatherCodeToCondition } from '@/lib/utils';
import { Wind } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

type TCurrentWeather = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
};

const CurrentlyTab = () => {
  const location = useLocationStore((state) => state.location);
  const error = useLocationStore((state) => state.error);
  const [currentWeather, setCurrentWeather] = useState<TCurrentWeather | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchCurrentWeather = async () => {
      const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,wind_speed_10m,weathercode&timezone=Europe%2FParis`
      );
      const currentwether = await weather.json();
      console.log('Current weather', currentwether);
      const parsedData = {
        temperature: currentwether.current.temperature_2m,
        windSpeed: currentwether.current.wind_speed_10m,
        weatherCode: currentwether.current.weathercode,
      };
      console.log('Current weather', parsedData);
      setCurrentWeather(parsedData);
    };

    fetchCurrentWeather();
  }, [location]);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Typography variant="large" style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Typography variant="h1">{location.name}</Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Typography>{location.region}</Typography>
          <Typography>{location.country}</Typography>
        </View>
      </View>
      <View style={styles.container}>
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {currentWeather?.temperature !== undefined && (
            <Typography variant="h1">{currentWeather?.temperature}°</Typography>
          )}
          {currentWeather?.weatherCode !== undefined && (
            <View style={{ flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography>
                {React.createElement(weatherCodeToCondition(currentWeather.weatherCode).icon, { size: 50 })}
              </Typography>
              <Typography variant="muted">{weatherCodeToCondition(currentWeather.weatherCode).label}</Typography>
            </View>
          )}
          {currentWeather?.windSpeed !== undefined && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Wind />
              <Typography>{currentWeather?.windSpeed} km/h</Typography>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CurrentlyTab;
