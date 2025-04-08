import { styles } from '@/assets/styles';
import useLocationStore from '@/hooks/locationStore';
import { SafeAreaView, Text } from 'react-native';

const TodayTab = () => {
  const location = useLocationStore((state) => state.location);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.largeText}>Today</Text>
      <Text>{location}</Text>
    </SafeAreaView>
  );
};

export default TodayTab;
