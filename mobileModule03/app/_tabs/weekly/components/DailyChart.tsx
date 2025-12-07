import useLocationStore from "@/hooks/locationStore";
import { getDateAsString } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { TDailyWeather } from "./types";

export const DailyChart: React.FC<{ dailyWeather: TDailyWeather[] }> = ({ dailyWeather }) => {
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
  }, [graphContainerRef.current, location, Dimensions.get("window").width, dailyWeather.length]);

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
            dailyWeather.length > 0
              ? dailyWeather.map((item, index) =>
                  index % 2 === 0 ? getDateAsString({ date: item.day, type: ["DAY", "MONTH"], separator: "/" }) : ""
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
