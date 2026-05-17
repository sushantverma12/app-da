import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Resource } from '@/types';
import { Colors, radius } from '@/constants/theme';

interface Props {
  resources: Resource[];
  district: string;
}

export function ResourceMap({ resources, district }: Props) {
  const mapRegion = {
    latitude: resources[0]?.lat ?? 25.61,
    longitude: resources[0]?.lng ?? 85.14,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  return (
    <View style={styles.wrap} testID="resource-map">
      <MapView style={styles.map} initialRegion={mapRegion}>
        {resources.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.lat, longitude: r.lng }}
            title={r.name}
            description={r.phone || r.type}
          />
        ))}
      </MapView>
      {resources.length === 0 ? (
        <Text style={styles.empty}>No resources found for {district}.</Text>
      ) : (
        resources.map((r) => (
          <Text key={r.id} style={styles.resource}>
            {r.type === 'hospital' ? '🏥' : r.type === 'fire_station' ? '🚒' : r.type === 'police' ? '👮' : '🏕️'}{' '}
            {r.name} {r.phone ? `· ${r.phone}` : ''}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  map: { height: 220, borderRadius: radius.card },
  empty: { color: Colors.textSecondary, paddingVertical: 8 },
  resource: { fontSize: 14, color: Colors.textSecondary, paddingVertical: 4 },
});
