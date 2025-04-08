import AppBar from '@/components/AppBar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import useLocationStore from '@/hooks/locationStore';
import * as Location from 'expo-location';
import { Tabs } from 'expo-router';
import { Calendar, CalendarDays, Navigation, Search, Settings } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView, View } from 'react-native';

const TabLayout = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const setLocation = useLocationStore((state) => state.setLocation);

  const handleGeolocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { coords } = location;

    const address = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    setLocation(address[0]?.city ?? '');
  };

  const handleSearch = (text: string) => {
    setLocation(text);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <AppBar>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 10 }}>
          <Search color="black" />
          <Input
            placeholder="Search"
            style={{ flex: 1 }}
            onChangeText={setSearchLocation}
            value={searchLocation}
            onBlur={() => handleSearch(searchLocation)}
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
