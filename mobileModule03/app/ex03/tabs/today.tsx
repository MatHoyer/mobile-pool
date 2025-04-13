import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { getDateAsString, weatherCodeToCondition } from '@/lib/utils';
import { Wind } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

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
  const setError = useLocationStore((state) => state.setError);
  const graphContainerRef = useRef<View>(null);
  const [graphContainerPosition, setGraphContainerPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!location) return;

    const fetchHourlyWeather = async () => {
      try {
        const weather = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,wind_speed_10m,weathercode&forecast_days=1&timezone=Europe%2FParis`
        );
        if (!weather.ok) {
          throw new Error('Failed to fetch weather data');
        }
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
      } catch (error) {
        setError('Failed to fetch weather data');
      }
    };
    fetchHourlyWeather();
  }, [location]);

  useEffect(() => {
    graphContainerRef.current?.measureInWindow((x, y, width, height) => {
      console.log('Graph container position', width, height);
      setGraphContainerPosition({ x, y, width, height });
    });
  }, [graphContainerRef.current, Dimensions.get('window').width, Dimensions.get('window').height, location]);

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
      <View
        ref={graphContainerRef}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: 10,
          padding: 10,
          marginHorizontal: 10,
          overflow: 'hidden',
        }}
      >
        <LineChart
          data={hourlyWeather.map((item) => ({
            value: item.temperature,
            dataPointText: `${item.temperature}°C`,
            label: getDateAsString({ date: item.hour, type: ['HOUR'], separator: '' }),
          }))}
          curved
          color="#FF6B6B"
          startFillColor="rgba(255,107,107,0.2)"
          endFillColor="rgba(255,107,107,0)"
          spacing={Math.max(20, (graphContainerPosition.width - 80) / hourlyWeather.length)}
          hideDataPoints={false}
          dataPointsColor="#FF6B6B"
          dataPointsRadius={4}
          yAxisTextStyle={{ color: 'white' }}
          showVerticalLines
          verticalLinesColor="rgba(255,255,255,0.1)"
          yAxisLabelWidth={40}
          initialSpacing={20}
          width={graphContainerPosition.width - 40}
          height={graphContainerPosition.height - 40}
        />
      </View>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          paddingVertical: 10,
          borderRadius: 10,
          marginHorizontal: 10,
          marginBottom: 10,
        }}
      >
        <FlatList
          style={{ width: '100%', alignSelf: 'center' }}
          data={hourlyWeather}
          horizontal
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'column', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>
              <Typography>{getDateAsString({ date: item.hour, type: ['HOUR', 'MINUTE'], separator: ':' })}</Typography>
              <View style={{ flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Typography>
                  {React.createElement(weatherCodeToCondition(item.weatherCode).icon, { size: 30 })}
                </Typography>
                <Typography variant="muted">{weatherCodeToCondition(item.weatherCode).label}</Typography>
              </View>
              <Typography>{item.temperature}°C</Typography>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Wind />
                <Typography>{item.windSpeed} km/h</Typography>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default TodayTab;
