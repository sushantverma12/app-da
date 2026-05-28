import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { ScreenShell } from '@/components/ScreenShell';
import { Colors, radius } from '@/constants/theme';

const MODULES = [
  { id: 'stretcher', title: 'Stretcher', icon: 'maximize-2' as const },
  { id: 'bandage', title: 'Bandage', icon: 'plus-square' as const },
  { id: 'cpr', title: 'CPR', icon: 'activity' as const },
  { id: 'ors', title: 'ORS', icon: 'droplet' as const },
  { id: 'smoke', title: 'Smoke Safety', icon: 'wind' as const },
  { id: 'flood-tools', title: 'Flood Tools', icon: 'tool' as const },
  { id: 'torch', title: 'Torch', icon: 'sun' as const },
  { id: 'water', title: 'Clean Water', icon: 'filter' as const },
  { id: 'head-protection', title: 'Head Cover', icon: 'hard-drive' as const },
  { id: 'rope', title: 'Escape Rope', icon: 'link' as const },
  { id: 'signal', title: 'Sound Signal', icon: 'volume-2' as const },
  { id: 'shelter', title: 'Shelter', icon: 'home' as const },
  { id: 'splint', title: 'Splint', icon: 'shield' as const },
  { id: 'heatstroke', title: 'Heatstroke', icon: 'thermometer' as const },
  { id: 'sling', title: 'Arm Sling', icon: 'heart' as const },
];

export default function FirstAidScreen() {
  return (
    <ScreenShell testID="first-aid-screen">
      <Stack.Screen options={{ headerShown: true, title: 'First Aid' }} />
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Feather name="heart" size={30} color={Colors.dangerRed} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.title}>First Aid</Text>
          <Text style={styles.sub}>Offline lessons for quick medical response.</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>MODULES</Text>
      <View style={styles.moduleGrid}>
        {MODULES.map((module) => (
          <Pressable key={module.id} style={styles.module} testID={`first-aid-${module.id}`}>
            <View style={styles.moduleIcon}>
              <Feather name={module.icon} size={20} color={Colors.primaryBlue} />
            </View>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.soon}>Soon</Text>
          </Pressable>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F4',
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F7D6D3',
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginRight: 14,
  },
  heroText: { flex: 1 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  sub: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  module: {
    width: '48%',
    minHeight: 112,
    backgroundColor: Colors.white,
    borderRadius: radius.card,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    justifyContent: 'space-between',
  },
  moduleIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FE',
  },
  moduleTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  soon: { alignSelf: 'flex-start', fontSize: 11, color: Colors.textSecondary, fontWeight: '800' },
});
