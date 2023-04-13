import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import styles from "../../styles/styles";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ navigation, route }) => {
  const [coords, setCoords] = useState({});

  useEffect(() => {
    if (route.params)
      setCoords({
        latitude: parseFloat(route.params.latitude),
        longitude: parseFloat(route.params.longitude),
      });
  }, [route.params]);
  
  return (
    <View style={styles.container}>
      {coords && <MapView
        style={{ flex: 1 }}
        region={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
        />
      </MapView>}
    </View>
  );
};

export default MapScreen;
