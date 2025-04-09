import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

type THourlyWeather = {
  hour: Date;
  temperature: number;
  windSpeed: number;
  weatherCode: number;
};

const TodayTab = () => {
  const location = useLocationStore((state) => state.location);
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
          Geolocation is not available, please enable it in your settings.
        </Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="large">Today</Typography>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {location.name && <Typography>{location.name}</Typography>}
        {location.region && <Typography>{location.region}</Typography>}
        {location.country && <Typography>{location.country}</Typography>}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Typography>{location.lat}</Typography>
        <Typography>{location.lon}</Typography>
      </View>
    </SafeAreaView>
  );
};

export default TodayTab;
