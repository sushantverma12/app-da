import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { ScreenShell } from '@/components/ScreenShell';
import { FeaturedRiskCard } from '@/components/FeaturedRiskCard';
import { DisasterGridCard } from '@/components/DisasterGridCard';
import { useDisasterStore } from '@/store/disasterStore';
import { useAuthStore } from '@/store/authStore';
import { DrillAlertBanner } from '@/components/DrillAlertBanner';
import { useActiveSchoolDrill } from '@/hooks/useActiveSchoolDrill';
import { getRiskForRegion, riskSortOrder } from '@/constants/disasters';
import { Colors, radius } from '@/constants/theme';

const logoMark = require('@/assets/images/app-logo-mark.png');

const brandFont = Platform.select({
  ios: 'Avenir Next',
  android: 'sans-serif-condensed',
  default: 'system-ui',
});

export default function HomeScreen() {
  const router = useRouter();
  const location = useDisasterStore((s) => s.location);
  const disasters = useDisasterStore((s) => s.disasters);
  const disastersLoading = useDisasterStore((s) => s.disastersLoading);
  const backendMode = useDisasterStore((s) => s.backendMode);
  const fetchDisasters = useDisasterStore((s) => s.fetchDisasters);
  const initJoinBanner = useDisasterStore((s) => s.initJoinBanner);
  const dismissed = useDisasterStore((s) => s.dismissedJoinBanner);
  const dismissBanner = useDisasterStore((s) => s.dismissJoinBanner);
  const user = useAuthStore((s) => s.user);
  const { drill: activeDrill } = useActiveSchoolDrill();
  const [bannerVisible, setBannerVisible] = useState(!dismissed);

  useEffect(() => {
    void initJoinBanner();
    fetchDisasters();
  }, [fetchDisasters, initJoinBanner]);

  const sorted = useMemo(() => {
    const district = location?.district ?? 'Patna';
    const state = location?.state ?? 'Bihar';
    return [...disasters]
      .map((d) => ({
        disaster: d,
        risk: getRiskForRegion(d, district, state),
      }))
      .sort((a, b) => riskSortOrder(a.risk) - riskSortOrder(b.risk));
  }, [location, disasters]);

  const featured = sorted[0];
  const gridItems = sorted.slice(1);

  return (
    <ScreenShell testID="home-screen">
      <View style={styles.header}>
        <View style={styles.brandLockup}>
          <View style={styles.brandMark}>
            <Image source={logoMark} resizeMode="contain" style={styles.brandMarkImage} />
          </View>
          <View>
            <Text style={styles.brand}>
              <Text style={styles.brandApp}>App</Text>
              <Text style={styles.brandDash}>-</Text>
              <Text style={styles.brandDa}>da</Text>
            </Text>
            <Text style={styles.brandTag}>disaster ready</Text>
          </View>
        </View>
        <Pressable
          style={styles.chip}
          testID="location-chip"
          onPress={() => router.push('/location')}
        >
          <Feather name="map-pin" size={14} color={Colors.primaryBlue} />
          <Text style={styles.chipText}>
            {location ? `${location.city}, ${location.state}` : 'Set location'}
          </Text>
        </Pressable>
      </View>

      {backendMode === 'firebase' ? (
        <Text style={styles.backendBadge} testID="backend-firebase">● Firebase connected</Text>
      ) : null}

      <View style={styles.quickActions}>
        <Pressable
          style={[styles.actionTile, styles.firstAidTile]}
          testID="first-aid-action"
          onPress={() => router.push('/first-aid')}
        >
          <View style={styles.actionIcon}>
            <Feather name="heart" size={24} color={Colors.dangerRed} />
          </View>
          <Text style={styles.actionTitle}>First Aid</Text>
          <Text style={styles.actionSub}>CPR, bleeding, burns</Text>
        </Pressable>
        <Pressable
          style={[styles.actionTile, styles.emergencyTile]}
          testID="emergency-action"
          onPress={() => router.push('/emergency')}
        >
          <View style={styles.actionIcon}>
            <Feather name="alert-triangle" size={24} color={Colors.warningAmber} />
          </View>
          <Text style={styles.actionTitle}>Emergency</Text>
          <Text style={styles.actionSub}>What to do now</Text>
        </Pressable>
      </View>

      {activeDrill ? <DrillAlertBanner drill={activeDrill} /> : null}

      {disastersLoading ? (
        <ActivityIndicator color={Colors.primaryBlue} style={{ marginVertical: 24 }} />
      ) : null}

      {featured ? (
        <>
          <Text style={styles.sectionLabel}>TODAY&apos;S RISK</Text>
          <FeaturedRiskCard
            disaster={featured.disaster}
            risk={featured.risk}
            onPress={() => router.push(`/disaster/${featured.disaster.id}`)}
          />
        </>
      ) : null}

      {bannerVisible && !user ? (
        <View style={styles.banner} testID="join-banner">
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Join your school for drills</Text>
            <Text style={styles.bannerSub}>Enter your school code to receive live alerts.</Text>
            <Pressable testID="join-btn" style={styles.joinBtn} onPress={() => router.push('/register')}>
              <Text style={styles.joinText}>Join</Text>
            </Pressable>
          </View>
          <Pressable
            testID="dismiss-banner"
            hitSlop={12}
            onPress={() => {
              dismissBanner();
              setBannerVisible(false);
            }}
          >
            <Feather name="x" size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.grid}>
        {gridItems.map(({ disaster, risk }) => (
          <DisasterGridCard
            key={disaster.id}
            disaster={disaster}
            risk={risk}
            onPress={() => router.push(`/disaster/${disaster.id}`)}
          />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: Colors.dangerRed,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  brandMarkImage: { width: 34, height: 34 },
  brand: {
    fontFamily: brandFont,
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 31,
    color: Colors.textPrimary,
  },
  brandApp: { color: Colors.primaryBlue },
  brandDash: { color: Colors.warningAmber },
  brandDa: { color: Colors.dangerRed },
  brandTag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F0FE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 13, color: Colors.primaryBlue, fontWeight: '500' },
  backendBadge: {
    fontSize: 11,
    color: Colors.safeGreen,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  actionTile: {
    flex: 1,
    minHeight: 126,
    borderRadius: radius.card,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  firstAidTile: { backgroundColor: '#FFF5F4' },
  emergencyTile: { backgroundColor: '#FFF8E8' },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  actionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  actionSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F4',
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
    gap: 8,
  },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  bannerSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  joinBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
