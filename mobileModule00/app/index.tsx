import { styles } from "@/assets/styles";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
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
  {
    title: "Exercise 02",
    href: "../ex02",
  },
  {
    title: "Exercise 03",
    href: "../ex03",
  },
] as const;

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.columnContainer, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.largeText}>Mobile Module 00</Text>
        {exercises.map((exercise) => (
          <Link href={exercise.href} asChild key={exercise.title}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{exercise.title}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </SafeAreaView>
  );
}
