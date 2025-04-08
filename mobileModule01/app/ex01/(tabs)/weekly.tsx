import { styles } from '@/assets/styles';
import { SafeAreaView, Text } from 'react-native';

const WeeklyTab = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.largeText}>Weekly</Text>
    </SafeAreaView>
  );
};

export default WeeklyTab;
