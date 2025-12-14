import { TDiary } from "@/lib/diaries/diaries.types";
import { View } from "react-native";
import Typography from "../Typography";

export const Diary: React.FC<{ diary: TDiary }> = ({ diary }) => {
  return (
    <View style={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
      <Typography variant="large">{diary.title}</Typography>
    </View>
  );
};
