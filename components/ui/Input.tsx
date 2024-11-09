import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import useTheme from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ 
  label, 
  error, 
  style, 
  ...props 
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
          style
        ]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1.5,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
}); 