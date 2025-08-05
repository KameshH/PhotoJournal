import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { initDB } from './database';
import { ThemeProvider } from './theme/ThemeContext';
import AppNavigator from './navigation/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    initDB();
  }, []);

  return (
    <ThemeProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </ThemeProvider>
  );
}

export default App;

