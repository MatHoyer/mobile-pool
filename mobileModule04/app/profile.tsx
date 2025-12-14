import { styles } from "@/assets/styles";
import Button from "@/components/Button";
import { Diaries } from "@/components/diaries/Diaries";
import PrivateRoute from "@/components/routes/PrivateRoute";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import { createDiary, deleteDiary } from "@/lib/diaries/diaries.utils";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ ...styles.container, flexDirection: "column", gap: 10 }}>
      <PrivateRoute>
        <Typography variant="large">Profile</Typography>
        <Diaries />
        <Button
          onPress={() =>
            createDiary({
              email: user?.email || "",
              title: "New Diary",
              content: "New Diary",
              date: new Date(),
              feeling: 0,
            })
          }
        >
          <Typography variant="buttonText">Create Diary</Typography>
        </Button>
        <Button onPress={() => deleteDiary("uU2ijqS4XGiuZf9Fig49")}>
          <Typography variant="buttonText">Delete Diary</Typography>
        </Button>
      </PrivateRoute>
    </SafeAreaView>
  );
};

export default Profile;
