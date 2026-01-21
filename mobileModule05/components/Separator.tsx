import { DimensionValue, View } from "react-native";

export const SeparatorVertical: React.FC<{ height?: DimensionValue }> = ({ height }) => {
  return <View style={{ width: 2, height: height ?? "100%", backgroundColor: "black" }} />;
};

export const SeparatorHorizontal: React.FC<{ width?: DimensionValue }> = ({ width }) => {
  return <View style={{ width: width ?? "100%", height: 2, backgroundColor: "black" }} />;
};
