import { Link } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.columnContainer}>
        <Link href="../ex00" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Exercise 00</Text>
          </TouchableOpacity>
        </Link>
        <Link href="../ex01" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Exercise 01</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Index;
