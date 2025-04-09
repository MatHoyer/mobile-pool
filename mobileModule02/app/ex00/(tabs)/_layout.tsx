import AppBar from '@/components/AppBar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import useLocationStore from '@/hooks/locationStore';
import * as Location from 'expo-location';
import { Href, Tabs, usePathname, useRouter } from 'expo-router';
import { Calendar, CalendarDays, Navigation, Search, Sun } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, GestureResponderEvent, SafeAreaView, TextInput, View } from 'react-native';

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
  const searchRef = useRef<TextInput>(null);
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
            }}
            onChangeText={setSearchLocation}
            value={searchLocation}
            inputRef={searchRef}
            onBlur={() => {
              setLocation({
                name: searchLocation,
                region: '',
                country: '',
                lat: 0,
                lon: 0,
              });
            }}
          />
          <View style={{ width: 2, height: 20, backgroundColor: 'black' }} />
          <View style={{ width: 40 }}>
            <Button variant="ghost" onPress={handleGeolocation}>
              <Navigation color="black" />
            </Button>
          </View>
        </View>
      </AppBar>
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
