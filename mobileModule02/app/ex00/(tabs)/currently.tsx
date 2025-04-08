import { styles } from '@/assets/styles';
import Typography from '@/components/Typography';
import useLocationStore from '@/hooks/locationStore';
import { SafeAreaView } from 'react-native';

const CurrentlyTab = () => {
  const location = useLocationStore((state) => state.location);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Typography variant="large" style={{ color: 'red', textAlign: 'center' }}>
          Geolocation is not available, please enable it in your settings.
        </Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="large">Currently</Typography>
      <Typography>{location}</Typography>
    </SafeAreaView>
  );
};

export default CurrentlyTab;
