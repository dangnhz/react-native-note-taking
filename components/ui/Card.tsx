import { View, StyleSheet, ViewStyle } from 'react-native';
import useTheme from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'flat';
}

export default function Card({ children, style, variant = 'elevated' }: CardProps) {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.card,
        borderColor: variant === 'flat' ? colors.border : 'transparent',
      },
      variant === 'elevated' && styles.elevated,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
}); 