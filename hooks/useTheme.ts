import React from 'react';
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColors {
  // Base colors
  background: string;
  surface: string;
  surfaceHover: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Status colors
  success: string;
  error: string;
  warning: string;
  
  // UI elements
  border: string;
  divider: string;
  card: string;
  cardHover: string;
  
  // Gradients
  gradientStart: string;
  gradientEnd: string;
}

interface ThemeStore {
  isDark: boolean;
  isSystemTheme: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setSystemTheme: (value: boolean) => void;
}

function generateColors(isDark: boolean): ThemeColors {
  if (isDark) {
    return {
      // Dark theme - Midnight Bloom theme
      background: '#0A0A0F',    // Deep dark background
      surface: '#13131A',      // Dark surface
      surfaceHover: '#1F1F2C', // Hover state
      primary: '#818CF8',      // Vibrant indigo primary
      primaryLight: '#A5B4FC',  // Light indigo
      secondary: '#F472B6',    // Pink
      accent: '#E879F9',       // Bright pink accent
      
      text: '#FFFFFF',         // Pure white text
      textSecondary: '#E2E8F0', // Light gray text
      textTertiary: '#94A3B8',  // Muted text
      
      success: '#34D399',      // Emerald green
      error: '#FB7185',        // Rose red
      warning: '#FBBF24',      // Amber
      
      border: '#27272A',       // Border color
      divider: '#27272A',      // Divider lines
      card: '#18181B',         // Card background
      cardHover: '#27272A',    // Card hover state
      
      gradientStart: '#818CF8', // Indigo gradient start
      gradientEnd: '#E879F9',   // Pink gradient end
    };
  }
  
  return {
    // Light theme - Midnight Bloom theme
    background: '#F8FAFC',     // Light background
    surface: '#FFFFFF',        // White surface
    surfaceHover: '#F1F5F9',  // Hover state
    primary: '#6366F1',       // Indigo primary
    primaryLight: '#818CF8',  // Light indigo
    secondary: '#EC4899',     // Pink
    accent: '#F472B6',       // Light pink accent
    
    text: '#0F172A',          // Dark blue text
    textSecondary: '#334155', // Secondary text
    textTertiary: '#64748B',  // Muted text
    
    success: '#10B981',       // Green
    error: '#F43F5E',         // Rose red
    warning: '#F59E0B',       // Amber
    
    border: '#E2E8F0',        // Border color
    divider: '#F1F5F9',       // Divider lines
    card: '#FFFFFF',          // Card background
    cardHover: '#F1F5F9',     // Card hover state
    
    gradientStart: '#6366F1', // Indigo gradient start
    gradientEnd: '#EC4899',   // Pink gradient end
  };
}

const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  isSystemTheme: true,
  colors: generateColors(false),
  toggleTheme: () => set((state) => {
    const newIsDark = !state.isDark;
    AsyncStorage.setItem('theme-preference', JSON.stringify({
      isDark: newIsDark,
      isSystemTheme: false
    }));
    return {
      isDark: newIsDark,
      isSystemTheme: false,
      colors: generateColors(newIsDark),
    };
  }),
  setSystemTheme: (value) => set((state) => {
    AsyncStorage.setItem('theme-preference', JSON.stringify({
      isDark: state.isDark,
      isSystemTheme: value
    }));
    return { isSystemTheme: value };
  }),
}));

export default function useTheme() {
  const systemColorScheme = useColorScheme();
  const { isDark, isSystemTheme, colors, toggleTheme } = useThemeStore();

  React.useEffect(() => {
    async function loadThemePreference() {
      try {
        const savedPreference = await AsyncStorage.getItem('theme-preference');
        if (savedPreference) {
          const { isDark: savedIsDark, isSystemTheme: savedIsSystemTheme } = JSON.parse(savedPreference);
          useThemeStore.setState({
            isDark: savedIsSystemTheme ? systemColorScheme === 'dark' : savedIsDark,
            isSystemTheme: savedIsSystemTheme,
            colors: generateColors(savedIsSystemTheme ? systemColorScheme === 'dark' : savedIsDark),
          });
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    }
    loadThemePreference();
  }, []);

  React.useEffect(() => {
    if (isSystemTheme) {
      const newIsDark = systemColorScheme === 'dark';
      useThemeStore.setState({
        isDark: newIsDark,
        colors: generateColors(newIsDark),
      });
    }
  }, [systemColorScheme, isSystemTheme]);

  return { isDark, colors, toggleTheme };
} 