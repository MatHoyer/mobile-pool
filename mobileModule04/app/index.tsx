import { styles } from "@/assets/styles";
import Button from "@/components/Button";
import PublicRoute from "@/components/route/PublicRoute";
import Typography from "@/components/Typography";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const TabViewIndex = () => {
  return (
    <SafeAreaView style={{ ...styles.container, flexDirection: "column", gap: 10 }}>
      <PublicRoute>
        <Typography variant="large">Welcome to your Diary</Typography>
        <Link href="/auth" asChild>
          <Button>
            <Typography variant="buttonText">Login</Typography>
          </Button>
        </Link>
      </PublicRoute>
    </SafeAreaView>
  );
};

export default TabViewIndex;
