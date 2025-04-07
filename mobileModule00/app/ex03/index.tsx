import { evaluate } from 'mathjs';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../assets/styles';
import AppBar from '../../components/AppBar';

const CalculatorButton: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={calculatorStyles.button} onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

const Ex03 = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(0);

  const handleCalculate = (expression: string) => {
    const result = evaluate(expression);
    setResult(result);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar>
        <Text style={styles.largeText}>Calculator</Text>
      </AppBar>
      <View style={calculatorStyles.calculator}>
        <View style={calculatorStyles.displayContainer}>
          <Text style={styles.largeText}>{expression || 0}</Text>
          <Text style={styles.largeText}>{result}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={calculatorStyles.buttonsContainer}>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="7" onPress={() => setExpression(expression + '7')} />
            <CalculatorButton label="8" onPress={() => setExpression(expression + '8')} />
            <CalculatorButton label="9" onPress={() => setExpression(expression + '9')} />
            <CalculatorButton label="C" onPress={() => setExpression(expression.slice(0, -1))} />
            <CalculatorButton
              label="AC"
              onPress={() => {
                setExpression('');
                setResult(0);
              }}
            />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="4" onPress={() => setExpression(expression + '4')} />
            <CalculatorButton label="5" onPress={() => setExpression(expression + '5')} />
            <CalculatorButton label="6" onPress={() => setExpression(expression + '6')} />
            <CalculatorButton label="+" onPress={() => setExpression(expression + '+')} />
            <CalculatorButton label="-" onPress={() => setExpression(expression + '-')} />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="1" onPress={() => setExpression(expression + '1')} />
            <CalculatorButton label="2" onPress={() => setExpression(expression + '2')} />
            <CalculatorButton label="3" onPress={() => setExpression(expression + '3')} />
            <CalculatorButton label="*" onPress={() => setExpression(expression + '*')} />
            <CalculatorButton label="/" onPress={() => setExpression(expression + '/')} />
          </View>
          <View style={calculatorStyles.buttonRow}>
            <CalculatorButton label="0" onPress={() => setExpression(expression + '0')} />
            <CalculatorButton label="." onPress={() => setExpression(expression + '.')} />
            <CalculatorButton label="00" onPress={() => setExpression(expression + '00')} />
            <CalculatorButton label="=" onPress={() => handleCalculate(expression)} />
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
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  displayContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 10,
    marginRight: 10,
  },

  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'white',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    display: 'flex',
    width: '20%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
