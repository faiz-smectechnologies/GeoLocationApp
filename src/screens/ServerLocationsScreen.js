// src/screens/ServerLocationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SERVER_URL = 'http://192.168.1.171:3000/api/trackers'; // Replace with your server URL

const ServerLocationsScreen = () => {
    const [serverLocations, setServerLocations] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        // Fetch server locations when the component mounts
        handleGetLocationFromServer();
    }, []);

    const handleGetLocationFromServer = async () => {
        try {
            const response = await axios.get(SERVER_URL);
            console.log(response.data);

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
        // Navigate to the Map screen with the selected location
        navigation.navigate('Map', { latitude, longitude });
    };

    return (
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
        </View>
    );
};

export default ServerLocationsScreen;
