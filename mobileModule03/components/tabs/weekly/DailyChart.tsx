import { getDateAsString } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { TDailyWeather } from "./types";

const DailyChart: React.FC<{ dailyWeather: TDailyWeather[] }> = ({ dailyWeather }) => {
  const [graphWidth, setGraphWidth] = useState(Dimensions.get("screen").width - 60);

  useEffect(() => {
    const handleResize = () => {
      setGraphWidth(Dimensions.get("screen").width - 60);
    };

    const event = Dimensions.addEventListener("change", handleResize);
    handleResize();

    return () => {
      event.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        overflow: "hidden",
      }}
    >
      <LineChart
        data={{
          labels:
            dailyWeather.length > 0
              ? dailyWeather.map((item, index) =>
                  index % 2 === 0 ? getDateAsString({ date: item.day, type: ["DAY", "MONTH"], separator: "/" }) : "",
                )
              : ["", ""],
          datasets: [
            {
              data: dailyWeather.length > 0 ? dailyWeather.map((item) => item.temperatureMax) : [0, 0],
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: dailyWeather.length > 0 ? dailyWeather.map((item) => item.temperatureMin) : [0, 0],
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ["Max °C", "Min °C"],
        }}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 10,
          },
        }}
        height={500}
        width={graphWidth}
        yAxisSuffix="°C"
        style={{
          borderRadius: 10,
        }}
      />
    </View>
  );
};

export default DailyChart;
