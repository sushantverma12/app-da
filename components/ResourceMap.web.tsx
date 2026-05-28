import React from 'react';
import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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

const RESOURCE_ICONS: Record<Resource['type'], keyof typeof MaterialCommunityIcons.glyphMap> = {
  hospital: 'hospital-building',
  fire_station: 'fire-truck',
  police: 'police-badge-outline',
  shelter: 'home-city-outline',
};

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
            <View style={styles.nameRow}>
              <MaterialCommunityIcons
                name={RESOURCE_ICONS[r.type]}
                size={20}
                color={Colors.primaryBlue}
              />
              <Text style={styles.name}>{r.name}</Text>
            </View>
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
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  phone: { fontSize: 14, color: Colors.primaryBlue, marginTop: 4 },
  coords: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
});
