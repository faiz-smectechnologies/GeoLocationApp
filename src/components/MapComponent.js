// src/components/MapComponent.js
import React from 'react';
import { View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapComponent = ({ onGetLocation }) => {
  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      onGetLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  return (
    <View>
      <MapView
        style={{ width: '100%', height: 300 }}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Display markers or customize the map as needed */}
        {/* <Marker
          coordinate={{ latitude: ..., longitude: ... }}
          title="Marker Title"
          description="Marker Description"
        /> */}
      </MapView>
      <Button title="Get Current Location" onPress={handleGetLocation} />
    </View>
  );
};

export default MapComponent;
