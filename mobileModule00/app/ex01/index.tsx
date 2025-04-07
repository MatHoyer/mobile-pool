import { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../assets/styles';

export const Ex01 = () => {
  const [text, setText] = useState('A simple text');

  const handlePress = () => {
    setText(text === 'A simple text' ? 'Hello World' : 'A simple text');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.columnContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.largeText}>{text}</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Click me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Ex01;
