import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView,Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [serverLocations, setServerLocations] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const postLocationToServer = async (latitude, longitude) => {
    const apiUrl = 'http://192.168.1.171:3000/api/trackers';

    try {
      const response = await axios.post(apiUrl, {
        latitude,
        longitude,
      });

      console.log('Axios Response:', response.data);

      // Handle successful response from the server if needed
      console.log('Location successfully posted to the server');
    } catch (error) {
      console.error('Error posting location to the server:', error.message);
    }
  };

  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setCurrentLatitude(currentLocation.coords.latitude);
      setCurrentLongitude(currentLocation.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);

      if (error instanceof Location.PermissionDeniedError) {
        setErrorMsg('Location permission denied');
      } else if (error instanceof Location.LocationUnavailableError) {
        setErrorMsg('Location services are unavailable');
      } else {
        setErrorMsg('Error getting location');
      }
    }
  };

  const handlePostLocation = () => {
    if (currentLatitude !== null && currentLongitude !== null) {
      postLocationToServer(currentLatitude, currentLongitude);
    } else {
      setErrorMsg('Location not available. Please get location first.');
    }
  };

  const handleGetLocationFromServer = async () => {
    const apiUrl = 'http://192.168.1.171:3000/api/trackers';

    try {
      const response = await axios.get(apiUrl);
      console.log(response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setServerLocations(response.data);
        setShowTable(true);
        setErrorMsg(null);
      } else {
        setErrorMsg('No location data available on the server');
      }
    } catch (error) {
      console.error('Error getting location from the server:', error.message);
      setErrorMsg('Error getting location from the server');
    }
  };

  const handleGoToMap = (latitude, longitude) => {
    const mapUrl = `geo:${latitude},${longitude}`;
    Linking.openURL(mapUrl);
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>GeoLocation App</Text>
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        {location && (
          <View style={{ flex: 1, width: '100%' }}>
            <MapView
              style={{ flex: 1, width: '100%', height: 300 }}
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Current Location"
                description="This is your current location"
              />
              {serverLocations.map((serverLocation, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: serverLocation.latitude,
                    longitude: serverLocation.longitude,
                  }}
                  title={`Server Location ${index + 1}`}
                  description={`This is server location ${index + 1}`}
                />
              ))}
            </MapView>
          </View>
        )}
        {currentLatitude !== null && currentLongitude !== null && (
          <View style={styles.locationInfo}>
            <Text>Your Location:</Text>
            <Text>Latitude: {currentLatitude}</Text>
            <Text>Longitude: {currentLongitude}</Text>
          </View>
        )}
        {showTable && (
          <View style={styles.locationInfo}>
            <Text>Server Locations:</Text>
            {serverLocations.map((serverLocation, index) => (
              <View key={index}>
                <Text>{`Latitude: ${serverLocation.latitude}`}</Text>
                <Text>{`Longitude: ${serverLocation.longitude}`}</Text>
                <Button title="Gomap" onPress={()=>{handleGoToMap(serverLocation.latitude,serverLocation.longitude)}} />
              </View>
            ))}
          </View>
        )}
        <Button title="Get Location" onPress={handleGetLocation} />
        <Button title="Post Location" onPress={handlePostLocation} />
        <Button title="Show Locations" onPress={handleGetLocationFromServer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  locationInfo: {
    marginTop: 10,
    marginBottom: 20,
  },
});
