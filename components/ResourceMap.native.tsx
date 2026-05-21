import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { Resource } from '@/types';
import { Colors, radius } from '@/constants/theme';

interface Props {
  resources: Resource[];
  district: string;
  center?: { lat: number; lng: number } | null;
}

export function ResourceMap({ resources, district, center }: Props) {
  const mapQuery = center ? `${center.lat},${center.lng}` : district;

  return (
    <View style={styles.wrap} testID="resource-map">
      <Pressable
        style={styles.mapFallback}
        onPress={() =>
          Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
          )
        }
      >
        <Text style={styles.mapTitle}>Nearby emergency resources</Text>
        <Text style={styles.mapSub}>Tap the map area or any resource to open directions in Google Maps.</Text>
      </Pressable>

      <Text style={styles.note}>Resources for {district}</Text>
      {resources.length === 0 ? (
        <Text style={styles.empty}>No resources found for {district}.</Text>
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

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  mapFallback: {
    minHeight: 150,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    padding: 18,
    marginBottom: 12,
  },
  mapTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  mapSub: { fontSize: 14, lineHeight: 20, color: Colors.textSecondary, marginTop: 6 },
  note: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  empty: { color: Colors.textSecondary },
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
