import AppBar from '@/components/AppBar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Typography from '@/components/Typography';
import useLocationStore, { TLocation } from '@/hooks/locationStore';
import * as Location from 'expo-location';
import { Calendar, CalendarDays, Navigation, Search, Sun } from 'lucide-react-native';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { NavigationState, Route, SceneMap, TabView } from 'react-native-tab-view';
import CurrentlyTab from './tabs/currently';
import TodayTab from './tabs/today';
import WeeklyTab from './tabs/weekly';

const renderScene = SceneMap({
  currently: CurrentlyTab,
  today: TodayTab,
  weekly: WeeklyTab,
});

const routes = [
  { key: 'currently', title: 'Currently' },
  { key: 'today', title: 'Today' },
  { key: 'weekly', title: 'Weekly' },
];

const CustomTabbar: React.FC<{
  navigationState: NavigationState<Route>;
  jumpTo: (key: string) => void;
}> = ({ navigationState, jumpTo }) => {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
      {navigationState.routes.map((route, index) => {
        const isFocused = navigationState.index === index;
        const color = isFocused ? 'orange' : 'gray';

        const renderIcon = () => {
          switch (route.key) {
            case 'currently':
              return <Sun color={color} size={24} />;
            case 'today':
              return <Calendar color={color} size={24} />;
            case 'weekly':
              return <CalendarDays color={color} size={24} />;
            default:
              return null;
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={() => jumpTo(route.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              padding: 10,
            }}
          >
            {renderIcon()}
            <Text style={{ color, marginTop: 4 }}>{route.title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

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

const TabLayout = () => {
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  const [searchLocation, setSearchLocation] = useState('');
  const [suggestions, setSuggestions] = useState<TLocation[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const searchRef = useRef<TextInput>(null);
  const touchingSuggestionRef = useRef(false);
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const setError = useLocationStore((state) => state.setError);

  const handleGeolocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Geolocation is not available, please enable it in your settings.');
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
      const resultSuggestions = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchLocation
        )}&count=5&language=fr&format=json`
      );
      if (!resultSuggestions.ok) {
        setError('The service connection is lost, please check your internet connection or try again later');
        return;
      }
      const jsonData = (await resultSuggestions.json()) as {
        results: { name: string; admin1: string; country: string; latitude: number; longitude: number }[];
      };
      if (!jsonData?.results) {
        setSuggestions([]);
        return;
      }
      const data = jsonData.results
        .map((item) => ({
          name: item.name,
          region: item.admin1,
          country: item.country,
          lat: item.latitude,
          lon: item.longitude,
        }))
        .filter((s) => s.name || s.region || s.country);
      setSuggestions(data);
    };

    const fetchTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 150);

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
    >
      <AppBar>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 10 }}>
          <Search color="black" />
          <Input
            placeholder="Search location"
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
              setTimeout(() => {
                setIsFocused(false);
              }, 200);
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
              setError('Could not find any result for the supplied adress or coordinates');
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

      <ImageBackground
        source={require('@/assets/images/background.png')}
        resizeMode="cover"
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          tabBarPosition="bottom"
          renderTabBar={(props) => <CustomTabbar {...props} />}
          lazy
        />
      </ImageBackground>

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
    </SafeAreaView>
  );
};

export default TabLayout;
