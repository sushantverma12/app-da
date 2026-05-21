import React from 'react';
import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { Resource } from '@/types';
import { Colors, radius } from '@/constants/theme';

interface Props {
  resources: Resource[];
  district: string;
  center?: { lat: number; lng: number } | null;
}

export function ResourceMap({ resources, district, center: fallbackCenter }: Props) {
  const center = getMapCenter(resources, fallbackCenter);
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.06}%2C${center.lat - 0.04}%2C${center.lng + 0.06}%2C${center.lat + 0.04}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;

  return (
    <View style={styles.wrap} testID="resource-map">
      <View style={styles.mapFrame}>
        {React.createElement('iframe', {
          src: iframeSrc,
          title: `${district} resource map`,
          style: styles.iframe,
          loading: 'lazy',
        })}
      </View>

      <Text style={styles.note}>Nearby resources for {district} — tap a card for directions:</Text>
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

function getMapCenter(
  resources: Resource[],
  fallbackCenter?: { lat: number; lng: number } | null
): { lat: number; lng: number } {
  if (resources.length === 0) return fallbackCenter ?? { lat: 22.5726, lng: 88.3639 };
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
  mapFrame: {
    height: 260,
    overflow: 'hidden',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
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
