import { DiaryTabBar } from "@/components/app/TabBar.diary";
import { SafeAreaView } from "react-native-safe-area-context";

const Logged = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DiaryTabBar />
    </SafeAreaView>
  );
};

export default Logged;
