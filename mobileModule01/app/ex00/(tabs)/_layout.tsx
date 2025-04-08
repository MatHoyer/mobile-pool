import { Tabs } from 'expo-router';
import { Calendar, CalendarDays, Settings } from 'lucide-react-native';

const TabLayout = () => {
  return (
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
  );
};

export default TabLayout;
