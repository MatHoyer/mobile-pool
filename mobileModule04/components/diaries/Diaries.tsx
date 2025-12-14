import useAuth from "@/hooks/useAuth";
import { TDiary } from "@/lib/diaries/diaries.types";
import { getUserLastDiaries } from "@/lib/diaries/diaries.utils";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import Typography from "../Typography";
import { Diary } from "./Diary";

export const Diaries = () => {
  const [diaries, setDiaries] = useState<TDiary[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user?.email) return;

    const getDiaries = async () => {
      const diaries = await getUserLastDiaries(user.email!);
      setDiaries(diaries);
    };

    void getDiaries();
  }, [loading, user]);

  return (
    <View>
      <Typography variant="large">Your last diary entries</Typography>
      <FlatList
        data={diaries}
        renderItem={({ item }) => <Diary diary={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};
