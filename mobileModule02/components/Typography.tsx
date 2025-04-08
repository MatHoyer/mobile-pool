import { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';

const typographyStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  large: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  small: {
    fontSize: 12,
  },
  muted: {
    color: '#666',
  },
});

const Typography: React.FC<{ variant?: keyof typeof typographyStyles } & ComponentProps<typeof Text>> = ({
  variant = 'default',
  style,
  ...props
}) => {
  return <Text style={[typographyStyles[variant], style]} {...props} />;
};

export default Typography;
