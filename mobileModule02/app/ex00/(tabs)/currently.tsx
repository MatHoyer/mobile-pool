import { styles } from '@/assets/styles';
import useLocationStore from '@/hooks/locationStore';
import { SafeAreaView, Text } from 'react-native';

const CurrentlyTab = () => {
  const location = useLocationStore((state) => state.location);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.largeText, { color: 'red', textAlign: 'center' }]}>
          Geolocation is not available, please enable it in your settings.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.largeText}>Currently</Text>
      <Text>{location}</Text>
    </SafeAreaView>
  );
};

export default CurrentlyTab;
