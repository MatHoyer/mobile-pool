import { styles } from "@/assets/styles";
import useLocationStore from "@/hooks/locationStore";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CurrentlyTab = () => {
  const location = useLocationStore((state) => state.location);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.largeText}>Currently</Text>
      <Text>{location}</Text>
    </SafeAreaView>
  );
};

export default CurrentlyTab;
