import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  danger: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#f8f8f8',
  text: '#000000',
  textSecondary: '#666666',
  border: '#eeeeee',
  primary: '#007AFF',
  danger: '#FF3B30',
};

const darkColors: ThemeColors = {
  background: '#000000',
  surface: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  border: '#333333',
  primary: '#007AFF',
  danger: '#FF3B30',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

