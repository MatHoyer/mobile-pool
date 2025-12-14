import { styles } from "@/assets/styles";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const TabViewIndex = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), setUser);
    return subscriber;
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Button
          onPress={() => console.log("Login")}
          style={{
            width: "auto",
          }}
        >
          <Typography style={styles.buttonText}>Login</Typography>
        </Button>
      </SafeAreaView>
    );
  }

  return <SafeAreaView style={{ flex: 1 }}></SafeAreaView>;
};

export default TabViewIndex;
