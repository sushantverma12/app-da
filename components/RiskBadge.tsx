import { View, Text, StyleSheet } from 'react-native';
import { RiskColors } from '@/constants/theme';
import { RiskLevel } from '@/types';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const colors = RiskColors[level];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]} testID={`risk-badge-${level}`}>
      <Text style={[styles.text, { color: colors.text }]}>{level.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
});
