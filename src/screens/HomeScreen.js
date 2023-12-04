// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Get Current Location"
        onPress={() => navigation.navigate('Map')}
      />
      <Button
        title="Show Server Locations"
        onPress={() => navigation.navigate('ServerLocations')}
      />
    </View>
  );
};

export default HomeScreen;
