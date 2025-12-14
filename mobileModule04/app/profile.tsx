import { styles } from "@/assets/styles";
import PrivateRoute from "@/components/route/PrivateRoute";
import Typography from "@/components/Typography";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <SafeAreaView style={{ ...styles.container, flexDirection: "column", gap: 10 }}>
      <PrivateRoute>
        <Typography variant="large">Profile</Typography>
      </PrivateRoute>
    </SafeAreaView>
  );
};

export default Profile;
