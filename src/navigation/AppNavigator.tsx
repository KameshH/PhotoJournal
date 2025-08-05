import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';

import GalleryScreen from '../screens/GalleryScreen';
import CameraScreen from '../screens/CameraScreen';
import DetailScreen from '../screens/DetailScreen';

export type RootStackParamList = {
  Gallery: undefined;
  Camera: undefined;
  Detail: {
    entry: {
      id: number;
      uri: string;
      title: string;
      timestamp: string;
    };
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = {
    dark: isDarkMode,
    colors: {
      primary: '#007AFF',
      background: isDarkMode ? '#000' : '#fff',
      card: isDarkMode ? '#1a1a1a' : '#fff',
      text: isDarkMode ? '#fff' : '#000',
      border: isDarkMode ? '#333' : '#eee',
      notification: '#FF3B30',
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: 'bold' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900' as const,
      },
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Gallery"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

