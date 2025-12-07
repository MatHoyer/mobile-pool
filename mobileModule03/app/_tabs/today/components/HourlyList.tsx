import Typography from "@/components/Typography";
import { getDateAsString, weatherCodeToCondition } from "@/lib/utils";
import { Wind } from "lucide-react-native";
import React from "react";
import { FlatList, View } from "react-native";
import { THourlyWeather } from "./types";

export const HourlyList: React.FC<{ hourlyWeather: THourlyWeather[] }> = ({ hourlyWeather }) => {
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
        data={hourlyWeather}
        horizontal
        renderItem={({ item }) => (
          <View style={{ flexDirection: "column", alignItems: "center", gap: 10, paddingHorizontal: 20 }}>
            <Typography>{getDateAsString({ date: item.hour, type: ["HOUR", "MINUTE"], separator: ":" })}</Typography>
            <View style={{ flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Typography>
                {React.createElement(weatherCodeToCondition(item.weatherCode).icon, { size: 30 })}
              </Typography>
              <Typography variant="muted">{weatherCodeToCondition(item.weatherCode).label}</Typography>
            </View>
            <Typography>{item.temperature}°C</Typography>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Wind />
              <Typography>{item.windSpeed} km/h</Typography>
            </View>
          </View>
        )}
      />
    </View>
  );
};
