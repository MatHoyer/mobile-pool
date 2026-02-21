import { Diaries } from "@/components/diaries/Diaries";
import PrivateRoute from "@/components/routes/PrivateRoute";
import useLastDiariesStore from "@/hooks/lastDiariesStore";
import { TDiary } from "@/lib/diaries/diaries.types";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const CalendarTab = () => {
  const { allDiaries } = useLastDiariesStore();
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));

  const diariesByDate = useMemo(() => {
    return allDiaries.reduce(
      (acc, diary) => {
        const key = formatDate(diary.date);
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
    <ScrollView>
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
            markedDates={{
              ...Object.keys(diariesByDate).reduce(
                (acc, date) => ({
                  ...acc,
                  [date]: { marked: true, selectedColor: "blue" },
                }),
                {},
              ),
              [selectedDate]: { selected: true, selectedColor: "blue" },
            }}
          />
          <View style={{ flex: 1 }}>
            <Diaries diaries={diariesByDate[selectedDate] || []} height={"100%"} />
          </View>
        </PrivateRoute>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CalendarTab;
