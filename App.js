// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import ServerLocationsScreen
 from './src/screens/ServerLocationsScreen';
 import TrackUser from './src/screens/TrackUser';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="ServerLocations" component={ServerLocationsScreen} />
        <Stack.Screen name="TrackUser" component={TrackUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
