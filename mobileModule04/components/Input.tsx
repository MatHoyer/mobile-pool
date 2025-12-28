import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Typography from "./Typography";

const inputStyles = StyleSheet.create({
  default: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "black",
  },
});

const Input: React.FC<
  { variant?: keyof typeof inputStyles; inputRef?: React.RefObject<TextInput | null>; error?: string } & TextInputProps
> = ({ variant = "default", style, inputRef, error, ...props }) => {
  return (
    <View style={{ flexDirection: "column", gap: 1 }}>
      <TextInput
        style={[inputStyles[variant], style, !!error && { borderColor: "red" }]}
        placeholderTextColor="black"
        {...props}
        ref={inputRef}
      />
      {!!error && (
        <Typography variant="small" style={{ color: "red" }}>
          {error}
        </Typography>
      )}
    </View>
  );
};

export default Input;
