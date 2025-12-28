import useLastDiariesStore from "@/hooks/lastDiariesStore";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import { useAuth } from "../providers/auth.provider";
import Typography from "../Typography";
import { Diary } from "./Diary";

export const Diaries = () => {
  const { user } = useAuth();
  const { lastDiaries, getLastDiaries } = useLastDiariesStore();

  useEffect(() => {
    if (!user?.email) return;

    void getLastDiaries(user.email!);
  }, [user, getLastDiaries]);

  return (
    <View style={{ width: "100%", paddingHorizontal: 20, paddingVertical: 10, gap: 10 }}>
      <Typography variant="large" style={{ textAlign: "center" }}>
        Your last diary entries
      </Typography>
      <FlatList
        data={lastDiaries}
        renderItem={({ item }) => <Diary diary={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};
