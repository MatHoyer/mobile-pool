import { Dimensions, View } from "react-native";

import { getDateAsString } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { THourlyWeather } from "./types";

const HourlyChart: React.FC<{ hourlyWeather: THourlyWeather[] }> = ({ hourlyWeather }) => {
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
            hourlyWeather.length > 0
              ? hourlyWeather.map((item, index) =>
                  index % 4 === 0 ? getDateAsString({ date: item.hour, type: ["HOUR", "MINUTE"], separator: ":" }) : "",
                )
              : ["", ""],
          datasets: [
            {
              data: hourlyWeather.length > 0 ? hourlyWeather.map((item) => item.temperature) : [0, 0],
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ["Temperature (°C)"],
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

export default HourlyChart;
