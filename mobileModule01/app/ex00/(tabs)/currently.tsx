import { styles } from "@/assets/styles";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CurrentlyTab = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.largeText}>Currently</Text>
    </SafeAreaView>
  );
};

export default CurrentlyTab;
