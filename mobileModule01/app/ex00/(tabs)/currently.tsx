import { styles } from '@/assets/styles';
import { SafeAreaView, Text } from 'react-native';

const CurrentlyTab = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.largeText}>Currently</Text>
    </SafeAreaView>
  );
};

export default CurrentlyTab;
