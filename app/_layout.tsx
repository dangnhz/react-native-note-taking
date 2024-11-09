import { Stack } from 'expo-router';
import useTheme from '../hooks/useTheme';

export default function Layout() {
  const { colors, isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          color: colors.text,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerBackTitle: '',
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="note/[id]"
        options={{ 
          title: 'Edit Note',
          animation: 'slide_from_right',
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="note/new"
        options={{ 
          title: 'New Note',
          animation: 'slide_from_right',
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
} 