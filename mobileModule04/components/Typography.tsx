import { ComponentProps } from "react";
import { StyleSheet, Text } from "react-native";

const typographyStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontWeight: "normal",
  },
  large: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h1: {
    fontSize: 48,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 32,
    fontWeight: "bold",
  },
  h3: {
    fontSize: 24,
  },
  small: {
    fontSize: 12,
  },
  muted: {
    color: "#666",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

const Typography: React.FC<{ variant?: keyof typeof typographyStyles } & ComponentProps<typeof Text>> = ({
  variant = "default",
  style,
  ...props
}) => {
  return <Text style={[typographyStyles[variant], style]} {...props} />;
};

export default Typography;
