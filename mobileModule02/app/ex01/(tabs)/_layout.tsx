import AppBar from '@/components/AppBar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Typography from '@/components/Typography';
import useLocationStore, { TLocation } from '@/hooks/locationStore';
import * as Location from 'expo-location';
import { Href, Tabs, usePathname, useRouter } from 'expo-router';
import { Calendar, CalendarDays, Navigation, Search, Sun } from 'lucide-react-native';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, GestureResponderEvent, SafeAreaView, TextInput, View } from 'react-native';

const LocationSuggestions: React.FC<
  {
    suggestions: TLocation[];
    touchingSuggestionRef: React.MutableRefObject<boolean>;
    setIsFocused: (isFocused: boolean) => void;
  } & ComponentProps<typeof View>
> = ({ suggestions, touchingSuggestionRef, setIsFocused, style, ...props }) => {
  const setSelectedLocation = useLocationStore((state) => state.setLocation);

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
              setSelectedLocation(item);
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

const tabs = ['currently', 'today', 'weekly'];

const TabLayout = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const width = Dimensions.get('window').width;

  const handleTouchStart = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    setTouchStartX(locationX);
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const index = Math.round((locationX - touchStartX) / width);
    if (index === 0) return;
    setActiveIndex((prev) => Math.max(0, Math.min(tabs.length - 1, prev - index)));
  };

  useEffect(() => {
    if (pathname.endsWith(tabs[activeIndex])) return;
    const urlParts = pathname.split('/');
    const url = urlParts.slice(0, -1).join('/');
    router.push(`${url}/${tabs[activeIndex]}` as Href);
  }, [activeIndex]);

  const [searchLocation, setSearchLocation] = useState('');
  const [suggestions, setSuggestions] = useState<TLocation[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const searchRef = useRef<TextInput>(null);
  const touchingSuggestionRef = useRef(false);
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);

  const handleGeolocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocation(null);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { coords } = location;

    const address = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    setLocation({
      name: address[0]?.city ?? '',
      region: address[0]?.region ?? '',
      country: address[0]?.country ?? '',
      lat: coords.latitude,
      lon: coords.longitude,
    });
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
        setSuggestions(data);
      }
    };

    const fetchTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(fetchTimeout);
  }, [searchLocation]);

  useEffect(() => {
    setSearchLocation(!!location ? location.name : '');
  }, [location]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: 'relative',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
              if (suggestions.length > 0) {
                const suggestion = suggestions[0];
                setLocation({
                  name: suggestion.name,
                  region: suggestion.region,
                  country: suggestion.country,
                  lat: suggestion.lat,
                  lon: suggestion.lon,
                });
                return;
              }
              setLocation({
                name: searchLocation,
                region: '',
                country: '',
                lat: 0,
                lon: 0,
              });
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
        setIsFocused={setIsFocused}
      />
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
        <Tabs.Screen
          name="currently"
          options={{
            title: 'Currently',
            tabBarIcon: () => <Sun />,
          }}
        />
        <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: () => <Calendar /> }} />
        <Tabs.Screen name="weekly" options={{ title: 'Weekly', tabBarIcon: () => <CalendarDays /> }} />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabLayout;
