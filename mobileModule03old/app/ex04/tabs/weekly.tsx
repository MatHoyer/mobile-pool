import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { getDateAsString, weatherCodeToCondition } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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

    const fetchDailyWeather = async () => {
      try {
        const weather = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=Europe%2FParis`
        );
        if (!weather.ok) {
          throw new Error('Failed to fetch weather data');
        }
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
      } catch (error) {
        setError('Failed to fetch weather data');
      }
    };

    fetchDailyWeather();
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      graphContainerRef.current?.measureInWindow((x, y, width, height) => {
        setGraphContainerPosition({ x, y, width, height });
      });
    };

    const event = Dimensions.addEventListener('change', handleResize);
    handleResize();

    return () => {
      event.remove();
    };
  }, [graphContainerRef.current, location, Dimensions.get('window').width, dailyWeather.length]);

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
          data={{
            labels:
              dailyWeather.length > 0
                ? dailyWeather.map((item, index) =>
                    index % 2 === 0 ? getDateAsString({ date: item.day, type: ['DAY', 'MONTH'], separator: '/' }) : ''
                  )
                : ['', ''],
            datasets: [
              {
                data: dailyWeather.length > 0 ? dailyWeather.map((item) => item.temperatureMax) : [0, 0],
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: dailyWeather.length > 0 ? dailyWeather.map((item) => item.temperatureMin) : [0, 0],
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: ['Max °C', 'Min °C'],
          }}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 10,
            },
          }}
          height={graphContainerPosition.height - 65 > 0 ? graphContainerPosition.height - 65 : 0}
          width={graphContainerPosition.width - 20 > 0 ? graphContainerPosition.width - 20 : 0}
          yAxisSuffix="°C"
          style={{
            borderRadius: 10,
          }}
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
          data={dailyWeather}
          horizontal
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'column', alignItems: 'center', gap: 10, paddingHorizontal: 10 }}>
              <Typography>{getDateAsString({ date: item.day, type: ['DAY', 'MONTH'], separator: '/' })}</Typography>
              <View style={{ flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Typography>
                  {React.createElement(weatherCodeToCondition(item.weatherCode).icon, { size: 30 })}
                </Typography>
                <Typography variant="muted">{weatherCodeToCondition(item.weatherCode).label}</Typography>
              </View>
              <Typography style={{ color: 'red' }}>{item.temperatureMax}°C</Typography>
              <Typography style={{ color: 'blue' }}>{item.temperatureMin}°C</Typography>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default WeeklyTab;
