import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Resource } from '@/types';
import { Colors, radius } from '@/constants/theme';

interface Props {
  resources: Resource[];
  district: string;
  center?: { lat: number; lng: number } | null;
}

const UNIVERSAL_HELPLINES = [
  { label: 'National emergency', number: '112' },
  { label: 'Ambulance', number: '108' },
  { label: 'Fire', number: '101' },
  { label: 'Police', number: '100' },
  { label: 'Disaster management', number: '1078' },
  { label: 'Child helpline', number: '1098' },
];

export function ResourceMap({ resources, district, center }: Props) {
  const mapCenter = getMapCenter(resources, center);
  const mapQuery = `${mapCenter.lat},${mapCenter.lng}`;

  return (
    <View style={styles.wrap} testID="resource-map">
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
          latitudeDelta: resources.length > 0 ? 0.12 : 0.2,
          longitudeDelta: resources.length > 0 ? 0.12 : 0.2,
        }}
      >
        {resources.length > 0 ? (
          resources.map((resource) => (
            <Marker
              key={resource.id}
              coordinate={{ latitude: resource.lat, longitude: resource.lng }}
              title={resource.name}
              description={resource.phone || resource.type.replace('_', ' ')}
            />
          ))
        ) : (
          <Marker
            coordinate={{ latitude: mapCenter.lat, longitude: mapCenter.lng }}
            title={district}
            description="Selected location"
          />
        )}
      </MapView>
      <Pressable
        style={styles.openMapBtn}
        onPress={() =>
          Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
          )
        }
      >
        <Text style={styles.openMapText}>Open this area in Google Maps</Text>
      </Pressable>

      <Text style={styles.note}>Resources for {district}</Text>
      {resources.length === 0 ? (
        <View style={styles.helplineWrap}>
          <Text style={styles.empty}>No local resources found for {district}. Use these national helplines:</Text>
          {UNIVERSAL_HELPLINES.map((helpline) => (
            <Pressable
              key={helpline.number}
              style={styles.card}
              onPress={() => Linking.openURL(`tel:${helpline.number}`)}
            >
              <Text style={styles.name}>{helpline.label}</Text>
              <Text style={styles.phone}>{helpline.number} · Tap to call</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        resources.map((r) => (
          <Pressable
            key={r.id}
            style={styles.card}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`
              )
            }
          >
            <Text style={styles.name}>
              {r.type === 'hospital' ? '🏥' : r.type === 'fire_station' ? '🚒' : r.type === 'police' ? '👮' : '🏕️'}{' '}
              {r.name}
            </Text>
            {r.phone ? <Text style={styles.phone}>{r.phone}</Text> : null}
            <Text style={styles.coords}>
              {r.lat.toFixed(4)}, {r.lng.toFixed(4)} · Open in Maps
            </Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

function getMapCenter(
  resources: Resource[],
  fallbackCenter?: { lat: number; lng: number } | null
): { lat: number; lng: number } {
  if (resources.length === 0) return fallbackCenter ?? { lat: 20.5937, lng: 78.9629 };
  const totals = resources.reduce(
    (acc, resource) => ({
      lat: acc.lat + resource.lat,
      lng: acc.lng + resource.lng,
    }),
    { lat: 0, lng: 0 }
  );
  return { lat: totals.lat / resources.length, lng: totals.lng / resources.length };
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  map: {
    height: 240,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
  },
  openMapBtn: {
    backgroundColor: '#E8F0FE',
    borderRadius: radius.button,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  openMapText: { color: Colors.primaryBlue, fontWeight: '700' },
  note: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  empty: { color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  helplineWrap: { gap: 8 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
    marginBottom: 8,
  },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  phone: { fontSize: 14, color: Colors.primaryBlue, marginTop: 4 },
  coords: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
});
