import { styles } from "@/assets/styles";
import Button from "@/components/Button";
import { Diaries } from "@/components/diaries/Diaries";
import { useAuth } from "@/components/providers/auth.provider";
import PrivateRoute from "@/components/routes/PrivateRoute";
import Typography from "@/components/Typography";
import useLastDiariesStore from "@/hooks/lastDiariesStore";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useAuth();
  const { addDiary } = useLastDiariesStore();

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
        paddingVertical: 20,
      }}
    >
      <PrivateRoute>
        <Diaries />
        <Button
          onPress={() =>
            addDiary({
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
      </PrivateRoute>
    </SafeAreaView>
  );
};

export default Profile;
