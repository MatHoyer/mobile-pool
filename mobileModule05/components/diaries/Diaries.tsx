import { TDiary } from "@/lib/diaries/diaries.types";
import { DimensionValue, FlatList, View } from "react-native";
import Typography from "../Typography";
import { Diary } from "./Diary";

type TDiariesProps = {
  diaries: TDiary[];
  height?: DimensionValue;
};

export const Diaries: React.FC<TDiariesProps> = ({ diaries, height }) => {
  return (
    <View style={{ width: "100%", height, paddingHorizontal: 20, paddingVertical: 10, gap: 10 }}>
      <Typography variant="large" style={{ textAlign: "center" }}>
        Your last diary entries
      </Typography>
      {diaries.length > 0 ? (
        <FlatList
          data={diaries}
          renderItem={({ item }) => <Diary diary={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10 }}
        />
      ) : (
        <Typography variant="muted" style={{ textAlign: "center" }}>
          No diary entries found
        </Typography>
      )}
    </View>
  );
};
