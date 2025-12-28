import { ComponentProps } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const mainStyle = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "auto",
  },
});

const buttonStyles = StyleSheet.create({
  default: {
    backgroundColor: "#007AFF",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  destructive: {
    backgroundColor: "#FF3B30",
  },
});

const Button: React.FC<{ variant?: keyof typeof buttonStyles } & ComponentProps<typeof TouchableOpacity>> = ({
  variant = "default",
  style,
  ...props
}) => {
  return <TouchableOpacity style={[mainStyle.button, buttonStyles[variant], style]} {...props} />;
};

export default Button;
