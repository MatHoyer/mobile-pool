import Button from '@/components/Button';
import { router } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';
import { styles } from '../assets/styles';

const Index = () => {
  const exercises = [
    {
      title: 'Exercise 00',
      href: '../ex00',
    },
    {
      title: 'Exercise 01',
      href: '../ex01',
    },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.columnContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.largeText}>Mobile Module 01</Text>
        {exercises.map((exercise) => (
          <Button onPress={() => router.push(exercise.href)} key={exercise.title}>
            <Text style={styles.buttonText}>{exercise.title}</Text>
          </Button>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Index;
