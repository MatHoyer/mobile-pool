import { styles } from "@/assets/styles";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WeeklyTab = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.largeText}>Weekly</Text>
    </SafeAreaView>
  );
};

export default WeeklyTab;
