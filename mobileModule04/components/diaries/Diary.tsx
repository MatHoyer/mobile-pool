import useLastDiariesStore from "@/hooks/lastDiariesStore";
import { getDateAsString } from "@/lib/date.utils";
import { TDiary } from "@/lib/diaries/diaries.types";
import { useState } from "react";
import { View } from "react-native";
import Button from "../Button";
import { Dialog, TDialogProps } from "../Dialog";
import { useAuth } from "../providers/auth.provider";
import { SeparatorHorizontal, SeparatorVertical } from "../Separator";
import Typography from "../Typography";
import { getDiaryIcon } from "./Diary.icons";

const DiaryDetailsDialog: React.FC<{ diary: TDiary } & TDialogProps> = ({ diary, visible, onClose }) => {
  const { user } = useAuth();
  const { removeDiary } = useLastDiariesStore();

  const handleDelete = async () => {
    if (!user?.email) return;

    await removeDiary(diary.id, user.email);
    onClose();
  };

  return (
    <Dialog visible={visible} onClose={onClose}>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <Typography variant="large" style={{ fontSize: 18 }}>
          {getDateAsString({
            date: diary.date,
            type: ["DAY_IN_LETTER"],
          })}
          {", "}
          {getDateAsString({
            date: diary.date,
            type: ["MONTH_IN_LETTER", "DAY", "YEAR"],
            separator: " ",
          })}
        </Typography>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Typography>My Feeling:</Typography>
          <View style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: 10, borderRadius: 10 }}>
            {getDiaryIcon(diary.feeling)}
          </View>
        </View>
        <SeparatorHorizontal />
        <Typography variant="large">{diary.title}</Typography>
        <Typography>{diary.content}</Typography>
        <Button variant="destructive" onPress={handleDelete}>
          <Typography variant="buttonText">Delete</Typography>
        </Button>
      </View>
    </Dialog>
  );
};

export const Diary: React.FC<{ diary: TDiary }> = ({ diary }) => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  return (
    <Button
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "rgba(0,0,0,0.2)",
      }}
      onPress={() => setIsDetailsModalVisible(true)}
    >
      <Typography>{getDateAsString({ date: diary.date, type: ["DAY", "MONTH", "YEAR"], separator: "/" })}</Typography>
      {getDiaryIcon(diary.feeling)}
      <SeparatorVertical />
      <Typography variant="large">{diary.title}</Typography>
      <DiaryDetailsDialog
        diary={diary}
        visible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
      />
    </Button>
  );
};
