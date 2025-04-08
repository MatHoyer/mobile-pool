import AppBar from '@/components/AppBar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import useLocationStore from '@/hooks/locationStore';
import * as Location from 'expo-location';
import { Tabs } from 'expo-router';
import { Calendar, CalendarDays, Navigation, Search, Settings } from 'lucide-react-native';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, View } from 'react-native';

const LocationSuggestions: React.FC<ComponentProps<typeof View>> = ({ style, ...props }) => {
  return (
    <View
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
        data={['test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test']}
        renderItem={({ item }) => <Text style={{ padding: 10 }}>{item}</Text>}
        keyExtractor={(item, index) => '' + index}
      />
    </View>
  );
};

const TabLayout = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const searchRef = useRef<TextInput>(null);
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
  }, [searchRef.current]);

  useEffect(() => {
    console.log('inputPosition:', inputPosition);
  }, [inputPosition]);

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
            style={{ flex: 1, borderBottomLeftRadius: isFocused ? 0 : 8, borderBottomRightRadius: isFocused ? 0 : 8 }}
            onChangeText={setSearchLocation}
            value={searchLocation}
            inputRef={searchRef}
            onBlur={() => setIsFocused(false)}
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
        style={{
          display: isFocused ? 'flex' : 'none',
          top: inputPosition.y + inputPosition.height,
          left: inputPosition.x,
          width: inputPosition.width,
        }}
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
