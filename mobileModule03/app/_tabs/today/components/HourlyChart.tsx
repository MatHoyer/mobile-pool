import { Dimensions, View } from "react-native";

import useLocationStore from "@/hooks/locationStore";
import { getDateAsString } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { THourlyWeather } from "./types";

export const HourlyChart: React.FC<{ hourlyWeather: THourlyWeather[] }> = ({ hourlyWeather }) => {
  const location = useLocationStore((state) => state.location);
  const graphContainerRef = useRef<View>(null);
  const [graphContainerPosition, setGraphContainerPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      graphContainerRef.current?.measureInWindow((x, y, width, height) => {
        setGraphContainerPosition({ x, y, width, height });
      });
    };

    const event = Dimensions.addEventListener("change", handleResize);
    handleResize();

    return () => {
      event.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphContainerRef.current, location, hourlyWeather.length]);

  return (
    <View
      ref={graphContainerRef}
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
                  index % 4 === 0 ? getDateAsString({ date: item.hour, type: ["HOUR", "MINUTE"], separator: ":" }) : ""
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
        height={graphContainerPosition.height - 65 > 0 ? graphContainerPosition.height - 65 : 0}
        width={graphContainerPosition.width - 20 > 0 ? graphContainerPosition.width - 20 : 0}
        yAxisSuffix="°C"
        style={{
          borderRadius: 10,
        }}
      />
    </View>
  );
};
