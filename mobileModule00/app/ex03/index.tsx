import { styles } from "@/assets/styles";
import AppBar from "@/components/AppBar";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const signs = ["+", "-", "*", "/"];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const toPostfix = (tokens: (number | string)[]): (number | string)[] => {
  const output: (number | string)[] = [];
  const operators: string[] = [];

  const priority: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  for (const token of tokens) {
    if (typeof token === "number") {
      output.push(token);
    } else {
      while (operators.length && priority[operators[operators.length - 1]] >= priority[token]) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    }
  }

  while (operators.length) {
    output.push(operators.pop()!);
  }

  return output;
};

const calculatePostfix = (tokens: (number | string)[]): number => {
  const stack: number[] = [];

  for (const token of tokens) {
    if (typeof token === "number") {
      stack.push(token);
    } else {
      const right = stack.pop()!;
      const left = stack.pop()!;
      switch (token) {
        case "+":
          stack.push(left + right);
          break;
        case "-":
          stack.push(left - right);
          break;
        case "*":
          stack.push(left * right);
          break;
        case "/":
          stack.push(left / right);
          break;
      }
    }
  }

  return stack.pop()!;
};

const CalculatorButton: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={calculatorStyles.button} onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const Ex03 = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(0);

  const handleCalculate = (expression: string) => {
    const tokens: (string | number)[] = [];
    let numberToken: string = "";

    if (!numbers.includes(expression.at(-1) ?? "")) return;

    const parseNumberToken = (token: string) => {
      return token.includes(".") ? parseFloat(token) : parseInt(token);
    };

    for (const [index, char] of expression.split("").entries()) {
      if (signs.includes(char)) {
        if (numberToken) tokens.push(parseNumberToken(numberToken));
        tokens.push(char);
        numberToken = "";
      } else {
        numberToken += char;
      }
      if (index === expression.length - 1) tokens.push(parseNumberToken(numberToken));
    }

    for (const [index, token] of tokens.entries()) {
      if (token === "-" && signs.includes(tokens[index - 1] as string)) {
        tokens[index + 1] = -tokens[index + 1];
        tokens.splice(index, 1);
      }
    }

    setResult(calculatePostfix(toPostfix(tokens)));
  };

  const handleSignPress = (sign: "+" | "-" | "*" | "/") => {
    setExpression((prev) => {
      if (!prev) return "0" + sign;
      if (sign === "-") {
        if (prev.at(-1) === "-" && signs.includes(prev.at(-2) ?? "")) return prev.slice(0, -1) + sign;
        return prev + sign;
      }
      if (signs.includes(prev.at(-1) ?? "") && signs.includes(prev.at(-2) ?? "")) return prev.slice(0, -2) + sign;
      return (signs.includes(prev.at(-1) ?? "") ? prev.slice(0, -1) : prev) + sign;
    });
  };

  const handlePointPress = () => {
    setExpression((prev) => {
      for (const [index, char] of prev.split("").reverse().entries()) {
        if (signs.includes(char)) {
          const lastElement = prev.slice(-index);
          if (lastElement.includes(".")) return prev;
          return prev + ".";
        }
      }
      return prev.includes(".") ? prev : prev + ".";
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar>
        <Text style={styles.largeText}>Calculator</Text>
      </AppBar>
      <View style={calculatorStyles.calculator}>
        <View style={calculatorStyles.displayContainer}>
          <Text style={styles.largeText} ellipsizeMode="head" numberOfLines={1}>
            {expression || 0}
          </Text>
          <Text ellipsizeMode="head" numberOfLines={1}>
            {result}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={calculatorStyles.buttonsContainer}>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="7" onPress={() => setExpression(expression + "7")} />
            <CalculatorButton label="8" onPress={() => setExpression(expression + "8")} />
            <CalculatorButton label="9" onPress={() => setExpression(expression + "9")} />
            <CalculatorButton label="C" onPress={() => setExpression(expression.slice(0, -1))} />
            <CalculatorButton
              label="AC"
              onPress={() => {
                setExpression("");
                setResult(0);
              }}
            />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="4" onPress={() => setExpression(expression + "4")} />
            <CalculatorButton label="5" onPress={() => setExpression(expression + "5")} />
            <CalculatorButton label="6" onPress={() => setExpression(expression + "6")} />
            <CalculatorButton label="+" onPress={() => handleSignPress("+")} />
            <CalculatorButton label="-" onPress={() => handleSignPress("-")} />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="1" onPress={() => setExpression(expression + "1")} />
            <CalculatorButton label="2" onPress={() => setExpression(expression + "2")} />
            <CalculatorButton label="3" onPress={() => setExpression(expression + "3")} />
            <CalculatorButton label="*" onPress={() => handleSignPress("*")} />
            <CalculatorButton label="/" onPress={() => handleSignPress("/")} />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="0" onPress={() => setExpression(expression + "0")} />
            <CalculatorButton label="." onPress={() => handlePointPress()} />
            <CalculatorButton label="00" onPress={() => setExpression(expression + "00")} />
            <CalculatorButton label="=" onPress={() => handleCalculate(expression)} />
            <View style={calculatorStyles.button} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Ex03;

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
    maxWidth: "100%",
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
