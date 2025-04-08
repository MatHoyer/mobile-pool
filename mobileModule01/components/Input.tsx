import { StyleSheet, TextInput, TextInputProps } from 'react-native';

const inputStyles = StyleSheet.create({
  default: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

const Input: React.FC<{ variant?: keyof typeof inputStyles } & TextInputProps> = ({
  variant = 'default',
  style,
  ...props
}) => {
  return <TextInput style={[inputStyles[variant], style]} {...props} />;
};

export default Input;
