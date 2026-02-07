import { styles } from "@/assets/styles";
import Button from "@/components/Button";
import PublicRoute from "@/components/routes/PublicRoute";
import Typography from "@/components/Typography";
import { Link, router } from "expo-router";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

const signIn = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
  try {
    await signInWithPopup(getAuth(), provider);
    router.push("/");
  } catch {
    console.log("Popup closed");
  }
};

const LoginButtons = () => {
  return (
    <View style={{ ...styles.container, flexDirection: "column", gap: 10 }}>
      <Button
        onPress={async () => {
          await signIn(githubProvider);
        }}
      >
        <Typography variant="buttonText">Login with Github</Typography>
      </Button>
      <Button
        onPress={async () => {
          await signIn(googleProvider);
        }}
      >
        <Typography variant="buttonText">Login with Google</Typography>
      </Button>
      <Link href="/" asChild>
        <Button variant="ghost">
          <Typography>
            <ChevronLeft />
          </Typography>
        </Button>
      </Link>
    </View>
  );
};

const Auth = () => {
  return (
    <SafeAreaView style={{ ...styles.container, flexDirection: "column", gap: 10 }}>
      <PublicRoute>
        <LoginButtons />
      </PublicRoute>
    </SafeAreaView>
  );
};

export default Auth;
