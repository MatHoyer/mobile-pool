import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { getDateAsString, weatherCodeToCondition } from '@/lib/utils';
import { Calendar, ThermometerSnowflake, ThermometerSun } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';

type TDailyWeather = {
  day: Date;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
};

const WeeklyTab = () => {
  const location = useLocationStore((state) => state.location);
  const error = useLocationStore((state) => state.error);
  const [dailyWeather, setDailyWeather] = useState<TDailyWeather[]>([]);

  useEffect(() => {
    if (!location) return;

    const fetchDailyWeather = async () => {
      const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=Europe%2FParis`
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
          <Calendar />
        </View>
        <View style={{ width: '20%', alignItems: 'center' }}>
          <ThermometerSnowflake />
        </View>
        <View style={{ width: '20%', alignItems: 'center' }}>
          <ThermometerSun />
        </View>
      </View>
      <View style={{ width: '95%', alignSelf: 'center', height: 1, backgroundColor: 'gray' }} />
      <FlatList
        style={{ flex: 1, width: '100%', alignSelf: 'center', marginBottom: 50 }}
        data={dailyWeather}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 }}>
            <View style={{ width: '20%', alignItems: 'center' }}>
              <Typography>{getDateAsString({ date: item.day, type: ['DAY', 'MONTH'], separator: '/' })}</Typography>
            </View>
            <View style={{ width: '20%', alignItems: 'center' }}>
              <Typography>{item.temperatureMin}°C</Typography>
            </View>
            <View style={{ width: '20%', alignItems: 'center' }}>
              <Typography>{item.temperatureMax}°C</Typography>
            </View>
            <View style={{ width: '30%', alignItems: 'center' }}>
              <Typography>{weatherCodeToCondition(item.weatherCode)}</Typography>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default WeeklyTab;
