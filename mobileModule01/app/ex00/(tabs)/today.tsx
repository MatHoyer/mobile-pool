import { styles } from '@/assets/styles';
import { SafeAreaView, Text } from 'react-native';

const TodayTab = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.largeText}>Today</Text>
    </SafeAreaView>
  );
};

export default TodayTab;
