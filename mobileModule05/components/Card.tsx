import { View } from "react-native";

type CardProps = React.ComponentProps<typeof View>;

export const Card: React.FC<CardProps> = ({ style, children, ...props }) => {
  return (
    <View style={[{ backgroundColor: "rgba(0,0,0,0.2)", padding: 10, borderRadius: 10 }, style]} {...props}>
      {children}
    </View>
  );
};
