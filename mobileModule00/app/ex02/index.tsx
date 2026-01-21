import { styles } from "@/assets/styles";
import AppBar from "@/components/AppBar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CalculatorButton: React.FC<{ label: string }> = ({ label }) => {
  return (
    <TouchableOpacity style={calculatorStyles.button} onPress={() => console.log(`Button pressed: ${label}`)}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const Ex02 = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar>
        <Text style={styles.largeText}>Calculator</Text>
      </AppBar>
      <View style={calculatorStyles.calculator}>
        <View style={calculatorStyles.displayContainer}>
          <Text style={styles.largeText}>0</Text>
          <Text style={styles.largeText}>0</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={calculatorStyles.buttonsContainer}>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="7" />
            <CalculatorButton label="8" />
            <CalculatorButton label="9" />
            <CalculatorButton label="C" />
            <CalculatorButton label="AC" />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="4" />
            <CalculatorButton label="5" />
            <CalculatorButton label="6" />
            <CalculatorButton label="+" />
            <CalculatorButton label="-" />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="1" />
            <CalculatorButton label="2" />
            <CalculatorButton label="3" />
            <CalculatorButton label="*" />
            <CalculatorButton label="/" />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="0" />
            <CalculatorButton label="." />
            <CalculatorButton label="00" />
            <CalculatorButton label="=" />
            <View style={calculatorStyles.button} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Ex02;

const calculatorStyles = StyleSheet.create({
  calculator: {
    flex: 1,
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  displayContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
    marginRight: 10,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "50%",
    backgroundColor: "white",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    height: "25%",
  },
  button: {
    display: "flex",
    width: "20%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
