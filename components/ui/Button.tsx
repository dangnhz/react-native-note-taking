import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import useTheme from '../../hooks/useTheme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({ 
  onPress, 
  title, 
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.button,
        styles[size],
        {
          backgroundColor: 
            variant === 'primary' ? colors.primary :
            variant === 'secondary' ? colors.secondary :
            'transparent',
          borderColor: variant === 'outline' ? colors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 2 : 0,
        },
        style
      ]}
    >
      <Text style={[
        styles.text,
        styles[`${size}Text`],
        {
          color: variant === 'outline' ? colors.primary : colors.surface
        },
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
}); 