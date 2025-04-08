import { ComponentPropsWithoutRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const mainStyle = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
});

const buttonStyles = StyleSheet.create({
  default: {
    backgroundColor: '#007AFF',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const Button: React.FC<{ variant?: keyof typeof buttonStyles } & ComponentPropsWithoutRef<typeof TouchableOpacity>> = ({
  variant = 'default',
  ...props
}) => {
  return <TouchableOpacity style={[mainStyle.button, buttonStyles[variant]]} {...props} />;
};

export default Button;
