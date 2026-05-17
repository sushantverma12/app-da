import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { subscribeDrill, completeDrill } from '@/services/drills';
import { Drill } from '@/types';
import { Colors, radius } from '@/constants/theme';

export default function DrillLiveScreen() {
  const { drillId } = useLocalSearchParams<{ drillId: string }>();
  const router = useRouter();
  const [drill, setDrill] = useState<Drill | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!drillId) return;
    return subscribeDrill(drillId, setDrill);
  }, [drillId]);

  useEffect(() => {
    if (!drill) return;
    const end = new Date(drill.startedAt).getTime() + drill.durationMinutes * 60 * 1000;
    const tick = () => {
      const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0 && drill.status === 'active') {
        completeDrill(drill.id);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [drill]);

  if (!drill) {
    return (
      <View style={styles.center}>
        <Text>Loading drill...</Text>
      </View>
    );
  }

  const pct = drill.expectedCount
    ? Math.round((drill.checkedInCount / drill.expectedCount) * 100)
    : 0;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const endEarly = async () => {
    await completeDrill(drill.id);
    router.back();
  };

  if (drill.status === 'completed') {
    return (
      <View style={styles.container} testID="drill-summary">
        <Stack.Screen options={{ title: 'Drill Complete' }} />
        <Text style={styles.title}>Drill complete</Text>
        <Text style={styles.stat}>Expected: {drill.expectedCount}</Text>
        <Text style={styles.stat}>Checked in: {drill.checkedInCount}</Text>
        <Text style={styles.stat}>Logged-in: {drill.checkedInUIDs.length}</Text>
        <Text style={styles.stat}>Anonymous: {drill.anonymousCount}</Text>
        <Text style={styles.stat}>Completion: {pct}%</Text>
        <Pressable style={styles.btn} onPress={() => router.replace('/admin-profile')}>
          <Text style={styles.btnText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="drill-live-screen">
      <Stack.Screen options={{ title: 'Live Drill' }} />
      <Text style={styles.live}>🚨 {drill.disasterType.toUpperCase()} DRILL — LIVE</Text>
      <Text style={styles.counter}>
        {drill.checkedInCount} / {drill.expectedCount}
      </Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.pct}>{pct}% safe</Text>
      <Text style={styles.timer}>
        ⏱️ {mins}:{secs.toString().padStart(2, '0')}
      </Text>
      <Pressable testID="end-drill-btn" style={styles.btnDanger} onPress={endEarly}>
        <Text style={styles.btnText}>End drill early</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: Colors.bgLight, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  live: { fontSize: 16, fontWeight: '700', color: Colors.dangerRed, textAlign: 'center' },
  counter: { fontSize: 56, fontWeight: '800', textAlign: 'center', marginVertical: 16, color: Colors.textPrimary },
  barBg: { height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.safeGreen },
  pct: { textAlign: 'center', marginTop: 8, fontSize: 18, color: Colors.textSecondary },
  timer: { textAlign: 'center', fontSize: 24, marginVertical: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  stat: { fontSize: 16, marginBottom: 8, color: Colors.textPrimary },
  btn: { backgroundColor: Colors.primaryBlue, padding: 16, borderRadius: radius.button, alignItems: 'center', marginTop: 24 },
  btnDanger: { backgroundColor: Colors.dangerRed, padding: 16, borderRadius: radius.button, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700' },
});
