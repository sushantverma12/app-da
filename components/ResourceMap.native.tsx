import { View, Text, StyleSheet, Linking, Pressable, Image } from 'react-native';
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

const MAP_ZOOM = 12;

export function ResourceMap({ resources, district, center }: Props) {
  const mapCenter = getMapCenter(resources, center);
  const mapQuery = `${mapCenter.lat},${mapCenter.lng}`;
  const mapTiles = getMapTiles(mapCenter, MAP_ZOOM);

  return (
    <View style={styles.wrap} testID="resource-map">
      <View style={styles.mapFrame}>
        <View style={styles.tileGrid} testID="resource-map-tile-preview">
          {mapTiles.map((tile) => (
            <Image
              key={`${tile.x}-${tile.y}`}
              source={{ uri: tile.url }}
              style={styles.tile}
              resizeMode="cover"
            />
          ))}
        </View>
        <View style={styles.mapShade} />
        <View style={styles.marker}>
          <View style={styles.markerDot} />
        </View>
        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelTitle}>{district}</Text>
          <Text style={styles.mapLabelCoords}>
            {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
          </Text>
        </View>
      </View>
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

function getMapTiles(center: { lat: number; lng: number }, zoom: number) {
  const centerTile = latLngToTile(center.lat, center.lng, zoom);
  const x = Math.floor(centerTile.x);
  const y = Math.floor(centerTile.y);
  const tiles = [];

  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const tileX = x + col;
      const tileY = y + row;
      tiles.push({
        x: tileX,
        y: tileY,
        url: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
      });
    }
  }

  return tiles;
}

function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const scale = 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * scale,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale,
  };
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  mapFrame: {
    height: 240,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  tileGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    width: '33.3334%',
    height: '33.3334%',
  },
  mapShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  marker: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 28,
    height: 28,
    marginLeft: -14,
    marginTop: -14,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dangerRed,
  },
  mapLabel: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: radius.button,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mapLabelTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 15 },
  mapLabelCoords: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
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
