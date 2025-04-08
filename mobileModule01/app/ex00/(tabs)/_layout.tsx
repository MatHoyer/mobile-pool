import { Href, Tabs, usePathname, useRouter } from 'expo-router';
import { Calendar, CalendarDays, Sun } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Dimensions, GestureResponderEvent, SafeAreaView } from 'react-native';

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

  return (
    <SafeAreaView style={{ flex: 1 }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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
