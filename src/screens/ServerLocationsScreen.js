// src/screens/ServerLocationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps'; // Import the necessary components
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { calculateDistance } from '../utils/geoUtils';

const SERVER_URL = 'http://192.168.1.171:3000/api/trackers';

const ServerLocationsScreen = () => {
    const [serverLocations, setServerLocations] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        handleGetLocationFromServer();
    }, []);

    const handleGetLocationFromServer = async () => {
        try {
            const response = await axios.get(SERVER_URL);

            if (Array.isArray(response.data) && response.data.length > 0) {
                setServerLocations(response.data);
            } else {
                console.log('No location data available on the server');
            }
        } catch (error) {
            console.error('Error getting location from the server:', error.message);
        }
    };

    const handleGoToMap = (latitude, longitude) => {
        navigation.navigate('Map', { latitude, longitude });
    };

    const handleGetRoute = () => {
        navigation.navigate('Map', { serverLocations });
    };

    const calculateTotalDistance = () => {
        let totalDistance = 0;

        for (let i = 0; i < serverLocations.length - 1; i++) {
            const { latitude: lat1, longitude: lon1 } = serverLocations[i];
            const { latitude: lat2, longitude: lon2 } = serverLocations[i + 1];
            totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
        }

        return totalDistance;
    };

    return (
        <ScrollView>
            <View>
                <Text>Server Locations Screen</Text>
                {serverLocations.map((serverLocation, index) => (
                    <View key={index}>
                        <Text>{`Latitude: ${serverLocation.latitude}`}</Text>
                        <Text>{`Longitude: ${serverLocation.longitude}`}</Text>
                        <Button
                            title="Go Map"
                            onPress={() => handleGoToMap(serverLocation.latitude, serverLocation.longitude)}
                        />
                    </View>
                ))}
                <Button
                    title="Show Route"
                    onPress={() => {
                        handleGetRoute();
                        const totalDistance = calculateTotalDistance();
                        console.log(`Total distance traveled: ${totalDistance.toFixed(2)} meters`);
                    }}
                />
                {/* MapView to display the traveled route */}
                <MapView
                    style={{ flex: 1, height: 300 }}
                    initialRegion={{
                        latitude: serverLocations[0]?.latitude || 0,
                        longitude: serverLocations[0]?.longitude || 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {/* Display Markers for each server location */}
                    {serverLocations.map((location, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                            title={`Location ${index + 1}`}
                        />
                    ))}
                    {/* Display Polyline to connect the locations */}
                    {serverLocations.length > 1 && (
                        <Polyline
                            coordinates={serverLocations.map(location => ({
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }))}
                            strokeWidth={2}
                            strokeColor="blue"
                        />
                    )}
                </MapView>
            </View>
        </ScrollView>
    );
};

export default ServerLocationsScreen;
