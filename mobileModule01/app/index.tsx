import { styles } from "@/assets/styles";
import Button from "@/components/Button";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const exercises = [
  {
    title: "Exercise 00",
    href: "../ex00",
  },
  {
    title: "Exercise 01",
    href: "../ex01",
  },
] as const;

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.columnContainer, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.largeText}>Mobile Module 01</Text>
        {exercises.map((exercise) => (
          <Button key={exercise.title} onPress={() => router.push(exercise.href)}>
            <Text style={styles.buttonText}>{exercise.title}</Text>
          </Button>
        ))}
      </View>
    </SafeAreaView>
  );
}
