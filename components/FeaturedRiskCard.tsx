import { View, Text, Pressable, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { DisasterIcon } from './DisasterIcon';
import { FEATURED_TAGLINES, featuredIconColors } from '@/constants/disasterIcons';
import { Disaster, RiskLevel } from '@/types';
import { Colors, radius } from '@/constants/theme';

interface Props {
  disaster: Disaster;
  risk: RiskLevel;
  onPress: () => void;
}

export function FeaturedRiskCard({ disaster, risk, onPress }: Props) {
  const tagline = FEATURED_TAGLINES[disaster.id] ?? disaster.description;
  const displayTitle =
    disaster.id === 'cyclone' ? 'Cyclone' : disaster.title.split('&')[0].trim();
  const featuredColors = featuredIconColors(disaster.id);

  return (
    <Pressable testID={`featured-${disaster.id}`} style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.riskPill}>
          <Text style={styles.riskPillText}>{risk.toUpperCase()} RISK</Text>
        </View>
        <View style={styles.alertBadge}>
          <Feather name="alert-circle" size={18} color={Colors.white} />
        </View>
      </View>
      <View style={styles.body}>
        <DisasterIcon
          disasterId={disaster.id}
          size={36}
          variant="featured"
          tint={featuredColors.tint}
          circleBg={featuredColors.circleBg}
        />
        <View style={styles.textCol}>
          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.tagline} numberOfLines={2}>
            {tagline}
          </Text>
        </View>
      </View>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>View safety guide</Text>
        <Feather name="arrow-right" size={16} color={Colors.white} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dangerRed,
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 16,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  riskPill: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  riskPillText: { color: Colors.white, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  alertBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  textCol: { flex: 1 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.white, marginBottom: 6 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.92)', lineHeight: 20 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 12,
    borderRadius: radius.button,
  },
  ctaText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
});
