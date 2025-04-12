import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { getDateAsString, weatherCodeToCondition } from '@/lib/utils';
import { Clock, Thermometer, Wind } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';

type THourlyWeather = {
  hour: Date;
  temperature: number;
  windSpeed: number;
  weatherCode: number;
};

const TodayTab = () => {
  const location = useLocationStore((state) => state.location);
  const error = useLocationStore((state) => state.error);
  const [hourlyWeather, setHourlyWeather] = useState<THourlyWeather[]>([]);

  useEffect(() => {
    if (!location) return;

    const fetchHourlyWeather = async () => {
      const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,wind_speed_10m,weathercode&forecast_days=1&timezone=Europe%2FParis`
      );
      const hourlyWeather = await weather.json();
      console.log('Hourly weather', hourlyWeather);
      const parsedData = hourlyWeather.hourly.time.map((time: string, index: number) => ({
        hour: new Date(time),
        temperature: hourlyWeather.hourly.temperature_2m[index],
        windSpeed: hourlyWeather.hourly.wind_speed_10m[index],
        weatherCode: hourlyWeather.hourly.weathercode[index],
      }));
      console.log('Hourly weather', parsedData);
      setHourlyWeather(parsedData);
    };

    fetchHourlyWeather();
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: '20%', alignItems: 'center' }}>
          <Clock />
        </View>
        <View style={{ width: '20%', alignItems: 'center' }}>
          <Thermometer />
        </View>
        <View style={{ width: '20%', alignItems: 'center' }}>
          <Wind />
        </View>
      </View>
      <View style={{ width: '95%', alignSelf: 'center', height: 1, backgroundColor: 'gray' }} />
      <FlatList
        style={{ flex: 1, width: '100%', alignSelf: 'center', marginBottom: 50 }}
        data={hourlyWeather}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 }}>
            <View style={{ width: '20%', alignItems: 'center' }}>
              <Typography>{getDateAsString({ date: item.hour, type: ['HOUR', 'MINUTE'], separator: ':' })}</Typography>
            </View>
            <View style={{ width: '20%', alignItems: 'center' }}>
              <Typography>{item.temperature}°C</Typography>
            </View>
            <View style={{ width: '20%', alignItems: 'center' }}>
              <Typography>{item.windSpeed} km/h</Typography>
            </View>
            <View style={{ width: '30%', alignItems: 'center' }}>
              <View style={{ flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Typography>{React.createElement(weatherCodeToCondition(item.weatherCode).icon)}</Typography>
                <Typography variant="muted">{weatherCodeToCondition(item.weatherCode).label}</Typography>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default TodayTab;
