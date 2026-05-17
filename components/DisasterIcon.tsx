import { View, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DISASTER_ICON_CONFIG } from '@/constants/disasterIcons';

interface Props {
  disasterId: string;
  size?: number;
  tint?: string;
  circleBg?: string;
  showCircle?: boolean;
  variant?: 'grid' | 'featured';
}

const VALID_FEATHER = new Set(Object.keys(Feather.glyphMap || {}));
const VALID_MCI = new Set(Object.keys(MaterialCommunityIcons.glyphMap || {}));

export function DisasterIcon({
  disasterId,
  size = 28,
  tint,
  circleBg,
  showCircle = true,
  variant = 'grid',
}: Props) {
  const config = DISASTER_ICON_CONFIG[disasterId] ?? {
    family: 'feather' as const,
    name: 'alert-triangle',
    tint: '#5F6368',
    circleBg: '#F1F3F4',
  };

  const color =
    tint ??
    (variant === 'featured' ? config.featuredTint ?? config.tint : config.tint);
  const bg =
    circleBg ??
    (variant === 'featured' ? config.featuredCircleBg ?? config.circleBg : config.circleBg);

  let family = config.family;
  let name = config.name;
  if (family === 'material' && !VALID_MCI.has(name)) {
    family = 'feather';
    name = 'alert-triangle';
  }
  if (family === 'feather' && !VALID_FEATHER.has(name)) {
    name = 'alert-triangle';
  }

  const glyph =
    family === 'material' ? (
      <MaterialCommunityIcons
        name={name as keyof typeof MaterialCommunityIcons.glyphMap}
        size={size}
        color={color}
      />
    ) : (
      <Feather name={name as keyof typeof Feather.glyphMap} size={size} color={color} />
    );

  if (!showCircle) return glyph;

  const circleSize = size + 24;
  return (
    <View style={[styles.circle, { width: circleSize, height: circleSize, backgroundColor: bg }]}>
      {glyph}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
