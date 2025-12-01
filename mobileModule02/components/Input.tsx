import { StyleSheet, TextInput, TextInputProps } from "react-native";

const inputStyles = StyleSheet.create({
  default: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

const Input: React.FC<
  { variant?: keyof typeof inputStyles; inputRef?: React.RefObject<TextInput | null> } & TextInputProps
> = ({ variant = "default", style, inputRef, ...props }) => {
  return <TextInput style={[inputStyles[variant], style]} placeholderTextColor="black" {...props} ref={inputRef} />;
};

export default Input;
