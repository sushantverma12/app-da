import { Pressable, Text, View, StyleSheet } from 'react-native';
import { DisasterTileColors, Colors, radius } from '@/constants/theme';
import { RiskBadge } from './RiskBadge';
import { DisasterIcon } from './DisasterIcon';
import { Disaster, RiskLevel } from '@/types';

interface Props {
  disaster: Disaster;
  risk: RiskLevel;
  featured?: boolean;
  onPress: () => void;
}

export function DisasterCard({ disaster, risk, featured, onPress }: Props) {
  const bg = DisasterTileColors[disaster.id] ?? Colors.primaryBlue;
  return (
    <Pressable
      testID={`disaster-card-${disaster.id}`}
      onPress={onPress}
      style={[styles.card, { backgroundColor: bg }, featured && styles.featured]}
    >
      <DisasterIcon disasterId={disaster.id} size={34} tint={Colors.white} circleBg="rgba(255,255,255,0.2)" />
      <View style={styles.content}>
        <Text style={styles.title}>{disaster.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {disaster.description}
        </Text>
        <RiskBadge level={risk} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 12,
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featured: { minHeight: 130 },
  content: { flex: 1, gap: 6 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.white },
  desc: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
});
