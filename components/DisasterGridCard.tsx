import { Pressable, Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { DisasterIcon } from './DisasterIcon';
import { RiskBadge } from './RiskBadge';
import { iconBgForRisk, iconTintForRisk } from '@/constants/disasterIcons';
import { Disaster, RiskLevel } from '@/types';
import { Colors, radius } from '@/constants/theme';

interface Props {
  disaster: Disaster;
  risk: RiskLevel;
  onPress: () => void;
}

export function DisasterGridCard({ disaster, risk, onPress }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 16 * 2 - 12) / 2;
  const label = disaster.title.split('&')[0].trim().split(' ')[0];

  return (
    <Pressable
      testID={`disaster-card-${disaster.id}`}
      onPress={onPress}
      style={[styles.card, { width: cardWidth }]}
    >
      <DisasterIcon
        disasterId={disaster.id}
        size={26}
        tint={iconTintForRisk(disaster.id, risk)}
        circleBg={iconBgForRisk(disaster.id, risk)}
      />
      <Text style={styles.title}>{label === 'Cyclone' ? 'Cyclone' : label}</Text>
      <RiskBadge level={risk} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 10,
  },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
});
