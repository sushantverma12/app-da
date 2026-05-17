import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { Resource } from '@/types';
import { Colors, radius } from '@/constants/theme';

interface Props {
  resources: Resource[];
  district: string;
}

/** List + Google Maps links (works in Expo Go; embedded map needs a dev build). */
export function ResourceMap({ resources, district }: Props) {
  return (
    <View style={styles.wrap} testID="resource-map">
      <Text style={styles.note}>Nearby resources for {district} — tap to open in Maps:</Text>
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
