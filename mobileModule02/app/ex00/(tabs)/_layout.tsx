import AppBar from '@/components/AppBar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import * as Location from 'expo-location';
import { Tabs } from 'expo-router';
import { Calendar, CalendarDays, Navigation, Search, Settings } from 'lucide-react-native';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, TextInput, View } from 'react-native';

type TSuggestion = {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
};

const LocationSuggestions: React.FC<
  {
    suggestions: TSuggestion[];
    touchingSuggestionRef: React.MutableRefObject<boolean>;
    setSearchLocation: (location: string) => void;
    setIsFocused: (isFocused: boolean) => void;
  } & ComponentProps<typeof View>
> = ({ suggestions, touchingSuggestionRef, setSearchLocation, setIsFocused, style, ...props }) => {
  const handleTouchStart = () => {
    touchingSuggestionRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      touchingSuggestionRef.current = false;
    }, 300);
  };

  return (
    <View
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={[
        style,
        {
          position: 'absolute',
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#ccc',
          zIndex: 999,
          maxHeight: 200,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      ]}
      {...props}
    >
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <Button
            variant="ghost"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', height: 50, gap: 10 }}
            onPress={() => {
              setSearchLocation(item.name);
              setIsFocused(false);
            }}
          >
            <Typography>{item.name}</Typography>
            <Typography variant="muted">{item.region}</Typography>
            <Typography variant="muted">{item.country}</Typography>
          </Button>
        )}
        keyExtractor={(_, index) => '' + index}
      />
    </View>
  );
};

const TabLayout = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [suggestions, setSuggestions] = useState<TSuggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const searchRef = useRef<TextInput>(null);
  const touchingSuggestionRef = useRef(false);
  const setLocation = useLocationStore((state) => state.setLocation);

  const handleGeolocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocation(null);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { coords } = location;

    setLocation(coords.latitude + ' ' + coords.longitude);
  };

  useEffect(() => {
    handleGeolocation();
  }, []);

  useEffect(() => {
    searchRef.current?.measureInWindow((x, y, width, height) => {
      setInputPosition({ x, y, width, height });
    });
  }, [searchRef.current, isFocused]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchLocation) {
        const resultSuggestions = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchLocation
          )}&count=5&language=fr&format=json`
        );
        const jsonData = (await resultSuggestions.json()) as {
          results: { name: string; admin1: string; country: string; latitude: number; longitude: number }[];
        };
        if (!jsonData?.results) return;
        const data = jsonData.results.map((item) => ({
          name: item.name,
          region: item.admin1,
          country: item.country,
          lat: item.latitude,
          lon: item.longitude,
        }));
        console.log(data);
        setSuggestions(data);
      }
    };

    const fetchTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(fetchTimeout);
  }, [searchLocation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: 'relative',
      }}
    >
      <AppBar>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 10 }}>
          <Search color="black" />
          <Input
            placeholder="Search"
            style={{
              flex: 1,
              borderBottomLeftRadius: isFocused && suggestions.length > 0 ? 0 : 8,
              borderBottomRightRadius: isFocused && suggestions.length > 0 ? 0 : 8,
            }}
            onChangeText={setSearchLocation}
            value={searchLocation}
            inputRef={searchRef}
            onBlur={() => {
              if (touchingSuggestionRef.current) return;
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
          />
          <View style={{ width: 2, height: 20, backgroundColor: 'black' }} />
          <View style={{ width: 40 }}>
            <Button variant="ghost" onPress={handleGeolocation}>
              <Navigation color="black" />
            </Button>
          </View>
        </View>
      </AppBar>
      <LocationSuggestions
        suggestions={suggestions}
        style={{
          display: isFocused && suggestions.length > 0 ? 'flex' : 'none',
          top: inputPosition.y + inputPosition.height,
          left: inputPosition.x,
          width: inputPosition.width,
        }}
        touchingSuggestionRef={touchingSuggestionRef}
        setSearchLocation={setSearchLocation}
        setIsFocused={setIsFocused}
      />
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
        <Tabs.Screen
          name="currently"
          options={{
            title: 'Currently',
            tabBarIcon: () => <Settings />,
          }}
        />
        <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: () => <Calendar /> }} />
        <Tabs.Screen name="weekly" options={{ title: 'Weekly', tabBarIcon: () => <CalendarDays /> }} />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabLayout;
