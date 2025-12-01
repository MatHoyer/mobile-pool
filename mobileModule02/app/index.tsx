import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../assets/styles";

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

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.columnContainer, { justifyContent: "center", alignItems: "center" }]}>
        <Typography variant="large">Mobile Module 02</Typography>
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
