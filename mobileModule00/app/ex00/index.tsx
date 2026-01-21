import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../assets/styles";

const Ex00 = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.columnContainer, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.largeText}>A simple text</Text>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Button pressed")}>
          <Text style={styles.buttonText}>Click me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Ex00;
