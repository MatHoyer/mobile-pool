import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

type TDailyWeather = {
  day: Date;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
};

const WeeklyTab = () => {
  const location = useLocationStore((state) => state.location);
  const [dailyWeather, setDailyWeather] = useState<TDailyWeather[]>([]);

  useEffect(() => {
    if (!location) return;

    const fetchDailyWeather = async () => {
      const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=10&timezone=Europe%2FParis`
      );
      const dailyWeather = await weather.json();
      console.log('Daily weather', dailyWeather);
      const parsedData = dailyWeather.daily.time.map((time: string, index: number) => ({
        day: new Date(time),
        temperatureMax: dailyWeather.daily.temperature_2m_max[index],
        temperatureMin: dailyWeather.daily.temperature_2m_min[index],
        weatherCode: dailyWeather.daily.weathercode[index],
      }));
      console.log('Daily weather', parsedData);
      setDailyWeather(parsedData);
    };

    fetchDailyWeather();
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
      <Typography variant="large">Weekly</Typography>
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

export default WeeklyTab;
