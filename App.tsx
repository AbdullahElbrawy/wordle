import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/home';
import GameScreen from './screens/game';
import MultiplayerScreen from './screens/multiplayer';
import SettingsScreen from './screens/settings';
import StoryScreen from './screens/story';
import CreatePuzzleScreen from './screens/createPuzzle';
import PuzzleScreen from './screens/puzzle';
import { SettingsProvider } from './settingsContext';
import io from 'socket.io-client';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost';
const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

const socket = io(`${SOCKET_URL}:${SOCKET_PORT}`);

const Stack = createStackNavigator();

export default function App() {
  return (
    
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Multiplayer" component={MultiplayerScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Story" component={StoryScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}
