import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

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
          Geolocation is not available, please enable it in your settings.
        </Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="large">Currently</Typography>
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

export default CurrentlyTab;
