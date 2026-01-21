import Typography from "@/components/Typography";
import { getDateAsString, weatherCodeToCondition } from "@/lib/utils";
import React from "react";
import { FlatList, View } from "react-native";
import { TDailyWeather } from "./types";

const DailyList: React.FC<{ dailyWeather: TDailyWeather[] }> = ({ dailyWeather }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.2)",
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 10,
      }}
    >
      <FlatList
        style={{ width: "100%", alignSelf: "center" }}
        data={dailyWeather}
        horizontal
        renderItem={({ item }) => (
          <View style={{ flexDirection: "column", alignItems: "center", gap: 10, paddingHorizontal: 10 }}>
            <Typography>{getDateAsString({ date: item.day, type: ["DAY", "MONTH"], separator: "/" })}</Typography>
            <View style={{ flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Typography>
                {React.createElement(weatherCodeToCondition(item.weatherCode).icon, { size: 30 })}
              </Typography>
              <Typography variant="muted">{weatherCodeToCondition(item.weatherCode).label}</Typography>
            </View>
            <Typography style={{ color: "red" }}>{item.temperatureMax}°C</Typography>
            <Typography style={{ color: "blue" }}>{item.temperatureMin}°C</Typography>
          </View>
        )}
      />
    </View>
  );
};

export default DailyList;
