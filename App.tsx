import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import useCachedResources from './hooks/useCachedResources';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }}
      />
    </SafeAreaProvider>
  );
} 