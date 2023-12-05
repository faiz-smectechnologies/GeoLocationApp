// src/screens/MapScreen.js
import React from 'react';
import { View } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

const TrackUser = ({ route }) => {
    const { latitude, longitude } = route.params;

    // Calculate latitude and longitude differences for 150 km radius
    const latitudeDelta = 1.5;  // Approximately 1 degree is about 111 km
    const longitudeDelta = 1.5;

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta,
                }}
            >
                {/* Marker for the selected location */}
                <Marker coordinate={{ latitude, longitude }} title="Selected Location" />

                {/* Circle border around the map */}
                <Circle
                    center={{ latitude, longitude }}
                    radius={15 * 1000}  // 150 km converted to meters
                    strokeWidth={2}
                    strokeColor="rgba(0,0,255,0.5)"
                    fillColor="rgba(0,0,255,0.2)"
                />
            </MapView>
        </View>
    );
};

export default TrackUser;