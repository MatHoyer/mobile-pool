import { Diaries } from "@/components/diaries/Diaries";
import PrivateRoute from "@/components/routes/PrivateRoute";
import useLastDiariesStore from "@/hooks/lastDiariesStore";
import { TDiary } from "@/lib/diaries/diaries.types";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

export const CalendarTab = () => {
  const { allDiaries } = useLastDiariesStore();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const diariesByDate = useMemo(() => {
    return allDiaries.reduce(
      (acc, diary) => {
        const key = diary.date.toISOString().split("T")[0];
        if (acc[key]) {
          acc[key].push(diary);
        } else {
          acc[key] = [diary];
        }
        return acc;
      },
      {} as Record<string, TDiary[]>,
    );
  }, [allDiaries]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 10,
        paddingVertical: 20,
      }}
    >
      <PrivateRoute>
        <Calendar
          style={{ width: "100%", height: "100%" }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={Object.keys(diariesByDate).reduce(
            (acc, date) => ({
              ...acc,
              [date]: { marked: true, selectedColor: "blue" },
            }),
            {},
          )}
        />
        <View style={{ flex: 1 }}>
          <Diaries diaries={diariesByDate[selectedDate] || []} height={"100%"} />
        </View>
      </PrivateRoute>
    </SafeAreaView>
  );
};

export default CalendarTab;
